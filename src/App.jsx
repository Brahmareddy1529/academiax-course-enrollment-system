import { useState } from "react";
import "./App.css";

function App() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [loggedIn, setLoggedIn] = useState(false);

  const [studentId, setStudentId] = useState(null);
  const [studentName, setStudentName] = useState("");
  const [courses, setCourses] = useState([]);

  const [enrolledCourse, setEnrolledCourse] = useState(null);
  const [paymentDone, setPaymentDone] = useState(false);

  // =========================
  // LOGIN
  // =========================
  const handleLogin = async () => {
    try {
      const loginUrl =
        `/api/auth/login?username=${encodeURIComponent(username)}` +
        `&password=${encodeURIComponent(password)}`;

      console.log("LOGIN URL:", loginUrl);

      const response = await fetch(loginUrl, {
        method: "POST",
      });

      console.log("LOGIN STATUS:", response.status);

      const data = await response.json();

      console.log("LOGIN RESPONSE:", data);

      if (!response.ok) {
        alert("Login failed ❌");
        return;
      }

      if (data.message) {
        alert("Invalid username or password ❌");
        return;
      }

      // Store student information
      setStudentId(data.studentId);
      setStudentName(data.name);

      // Backend response may not contain username,
      // so keep the entered username.
      setUsername(username);

      // =========================
      // LOAD COURSES
      // =========================
      const courseResponse = await fetch("/api/courses", {
        method: "GET",
      });

      console.log(
        "COURSE STATUS:",
        courseResponse.status
      );

      const courseData = await courseResponse.json();

      console.log(
        "COURSE RESPONSE:",
        courseData
      );

      if (!courseResponse.ok) {
        alert("Unable to load courses ❌");
        return;
      }

      setCourses(courseData);

      // Login successful
      setLoggedIn(true);

    } catch (error) {
      console.error("LOGIN ERROR:", error);

      alert(
        "Backend connection failed ❌\n" +
        error.message
      );
    }
  };

  // =========================
  // ENROLL
  // =========================
  const handleEnroll = async (course) => {
    try {
      const response = await fetch(
        "/api/enrollments",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            studentId: studentId,
            courseId: course.id,
            enrollmentDate: "2026-09-25",
            status: "ENROLLED",
          }),
        }
      );

      const data = await response.json();

      console.log(
        "ENROLLMENT STATUS:",
        response.status
      );

      console.log(
        "ENROLLMENT RESPONSE:",
        data
      );

      if (!response.ok) {
        alert("Enrollment Failed ❌");
        return;
      }

      setEnrolledCourse(course);

    } catch (error) {
      console.error(
        "ENROLLMENT ERROR:",
        error
      );

      alert(
        "Enrollment error ❌\n" +
        error.message
      );
    }
  };

  // =========================
  // BACK TO COURSES
  // =========================
  const handleBack = () => {
    setEnrolledCourse(null);
    setPaymentDone(false);
  };

  // =========================
  // PAYMENT
  // =========================
  const handlePayment = async () => {
    try {
      const response = await fetch(
        "/api/payments",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            studentId: studentId,
            courseId: enrolledCourse.id,
            amount: 5000,
            paymentDate: "2026-09-25",
            status: "PAID",
          }),
        }
      );

      const data = await response.json();

      console.log(
        "PAYMENT STATUS:",
        response.status
      );

      console.log(
        "PAYMENT RESPONSE:",
        data
      );

      if (!response.ok) {
        alert("Payment Failed ❌");
        return;
      }

      setPaymentDone(true);

    } catch (error) {
      console.error(
        "PAYMENT ERROR:",
        error
      );

      alert(
        "Payment error ❌\n" +
        error.message
      );
    }
  };

  // =========================
  // DASHBOARD
  // =========================
  if (loggedIn) {
    return (
      <div className="dashboard">

        {/* HEADER */}
        <div className="dashboard-header">

          <div>
            <h1>AcademiaX 🎓</h1>

            <p>
              Welcome, {studentName}
            </p>
          </div>

          {/* PROFILE */}
          <div className="profile-box">

            <div className="profile-icon">
              👤
            </div>

            <div>
              <b>{username}</b>

              <span>
                Student ID: {studentId}
              </span>
            </div>

          </div>

        </div>

        {/* =========================
            COURSE LIST
        ========================= */}
        {!enrolledCourse && (
          <>
            <h2>
              Available Courses
            </h2>

            <div className="course-container">

              {courses.map((course) => (
                <div
                  className="course-card"
                  key={course.id}
                >

                  <h3>
                    {course.courseName}
                  </h3>

                  <p>
                    <b>Instructor:</b>{" "}
                    {course.instructor}
                  </p>

                  <p>
                    <b>Capacity:</b>{" "}
                    {course.capacity}
                  </p>

                  <p>
                    <b>Deadline:</b>{" "}
                    {course.deadline}
                  </p>

                  <button
                    onClick={() =>
                      handleEnroll(course)
                    }
                  >
                    Enroll
                  </button>

                </div>
              ))}

            </div>
          </>
        )}

        {/* =========================
            ENROLLMENT SUCCESS
        ========================= */}
        {enrolledCourse &&
          !paymentDone && (
            <div className="success-card">

              <button
                className="back-button"
                onClick={handleBack}
              >
                ← Back to Courses
              </button>

              <h2>
                Enrollment Successful ✅
              </h2>

              <h3>
                {enrolledCourse.courseName}
              </h3>

              <p>
                Tuition Fee: ₹5000
              </p>

              <button
                className="payment-button"
                onClick={handlePayment}
              >
                Pay ₹5000
              </button>

            </div>
          )}

        {/* =========================
            FINAL SUCCESS
        ========================= */}
        {paymentDone && (
          <div className="success-card">

            <h2>
              Registration Completed 🎉
            </h2>

            <p>
              Student: {studentName}
            </p>

            <p>
              Student ID: {studentId}
            </p>

            <p>
              Course:{" "}
              {enrolledCourse.courseName}
            </p>

            <p>
              Enrollment:
              Successful ✅
            </p>

            <p>
              Payment: Paid ✅
            </p>

            <button
              className="back-button"
              onClick={handleBack}
            >
              ← Back to Courses
            </button>

          </div>
        )}

      </div>
    );
  }

  // =========================
  // LOGIN PAGE
  // =========================
  return (
    <div className="login-container">

      <div className="login-card">

        <h1>
          AcademiaX 🎓
        </h1>

        <h2>
          Student Login
        </h2>

        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) =>
            setUsername(e.target.value)
          }
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
        />

        <button onClick={handleLogin}>
          Login
        </button>

      </div>

    </div>
  );
}

export default App;