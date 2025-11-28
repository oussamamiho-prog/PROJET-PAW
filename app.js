$(document).ready(function () {

    $("#togglePassword").on("click", function () {
        const inp = $("#password");
        const type = inp.attr("type") === "password" ? "text" : "password";
        inp.attr("type", type);
    });

    $("#forgotPasswordLink").on("click", function (e) {
        e.preventDefault();
        $("#forgotModal").css("display", "flex");
    });

    $("#closeModal").on("click", function () {
        $("#forgotModal").hide();
    });

    $("#sendReset").on("click", function () {
        const email = $("#forgotEmail").val().trim();
        if (email === "") {
            alert("Please enter your email.");
            return;
        }
        alert("Reset link sent to: " + email + " (demo only).");
        $("#forgotModal").hide();
    });

    $("#btnLogin").on("click", function () {
        const username = $("#username").val().trim();
        const password = $("#password").val().trim();

        if (username === "" || password === "") {
            alert("Please enter username and password.");
            return;
        }

        $.ajax({
            url: "./backend/login.php",
            method: "POST",
            contentType: "application/json",
            data: JSON.stringify({ username: username, password: password }),
            success: function (res) {
                if (res.success) {
                    if (res.role === "professor") window.location.href = "professor_home.html";
                    else if (res.role === "student") window.location.href = "student_home.html";
                    else if (res.role === "admin") window.location.href = "admin_home.html";
                } else {
                    alert(res.message || "Login failed");
                }
            },
            error: function () {
                alert("Server error");
            }
        });
    });

    function showError(msg) {
        const box = $("#errorMsg");
        box.text(msg).fadeIn(150);
        setTimeout(function () {
            box.fadeOut(250);
        }, 2500);
    }

    if (window.location.pathname.includes("professor_home.html")) {
        const data = [
            { course: "Web Programming", group: "G1", sessions: 10, last: "27/11/2025" },
            { course: "Databases",       group: "G2", sessions: 8,  last: "26/11/2025" },
            { course: "Networks",        group: "G1", sessions: 6,  last: "25/11/2025" }
        ];

        const tbody = $("#courseTableBody");
        data.forEach(function (row) {
            const tr = 
                <tr>
                    <td>${row.course}</td>
                    <td>${row.group}</td>
                    <td>${row.sessions}</td>
                    <td>${row.last}</td>
                    <td>
                        <button class="btn-link open-session">Open sessions</button>
                    </td>
                </tr>;
            tbody.append(tr);
        });

        $("#searchCourse").on("keyup", function () {
            const q = $(this).val().toLowerCase();
            $("#courseTableBody tr").each(function () {
                const text = $(this).text().toLowerCase();
                $(this).toggle(text.indexOf(q) !== -1);
            });
        });

        $(document).on("click", ".open-session", function () {
            window.location.href = "professor_session.html";
        });
    }

    if (window.location.pathname.includes("professor_session.html")) {
        const students = [
            { id: 1, matricule: "ST001", name: "Student One" },
            { id: 2, matricule: "ST002", name: "Student Two" },
            { id: 3, matricule: "ST003", name: "Student Three" }
        ];
    }

    if (window.location.pathname.includes("professor_summary.html")) {
        const rows = [
            { name: "Student One",   matricule: "ST001", present: 9, total: 10 },
            { name: "Student Two",   matricule: "ST002", present: 7, total: 10 },
            { name: "Student Three", matricule: "ST003", present: 10, total: 10 }
        ];const tbody = $("#summaryBody");
        rows.forEach(function (r) {
            const percent = Math.round((r.present / r.total) * 100);
            const tr = 
                <tr>
                    <td>${r.name}</td>
                    <td>${r.matricule}</td>
                    <td>${r.present}</td>
                    <td>${r.total}</td>
                    <td>${percent}%</td>
                </tr>;
            tbody.append(tr);
        });
    }
    
    if (window.location.pathname.includes("student_home.html")) {
        const courses = [
            { course: "Web Programming", group: "G1", percent: 90 },
            { course: "Databases",       group: "G2", percent: 80 }
        ];

        const tbody = $("#studentCoursesBody");
        courses.forEach(function (c) {
            const tr = 
                <tr>
                    <td>${c.course}</td>
                    <td>${c.group}</td>
                    <td>${c.percent}%</td>
                    <td><button class="btn-link open-course">View</button></td>
                </tr>;
            tbody.append(tr);
        });

        $(document).on("click", ".open-course", function () {
            window.location.href = "student_attendance.html";
        });
    }

    if (window.location.pathname.includes("student_attendance.html")) {
        const history = [
            { date: "20/11/2025", status: "Present", justif: "-" },
            { date: "22/11/2025", status: "Absent",  justif: "Pending" },
            { date: "25/11/2025", status: "Present", justif: "-" }
        ];

        const tbody = $("#studentHistoryBody");
        history.forEach(function (h) {
            const tr = 
                <tr>
                    <td>${h.date}</td>
                    <td>${h.status}</td>
                    <td>${h.justif}</td>
                </tr>;
            tbody.append(tr);
        });

        $("#btnSendJustif").on("click", function () {
            const date = $("#jusDate").val().trim();
            const reason = $("#jusReason").val().trim();

            if (date === "" || reason === "") {
                $("#jusMsg").text("Please select a date and enter a reason.")
                    .css("background", "#fee2e2")
                    .css("color", "#b91c1c")
                    .fadeIn(150);
            } else {
                $("#jusMsg").text("Justification sent (frontend demo).")
                    .css("background", "#dcfce7")
                    .css("color", "#166534")
                    .fadeIn(150);
            }

            setTimeout(function () {
                $("#jusMsg").fadeOut(250);
            }, 2500);
        });
    }

    if (window.location.pathname.includes("admin_home.html")) {
        $("#statStudents").text(120);
        $("#statProfessors").text(12);
        $("#statCourses").text(18);
    }

    if (window.location.pathname.includes("admin_students.html")) {
        let students = [
            { matricule: "ST001", name: "Student One", group: "G1" },
            { matricule: "ST002", name: "Student Two", group: "G1" }
        ];

        const tbody = $("#adminStudentsBody");

        function renderStudents() {
            tbody.empty();
            students.forEach(function (s, index) {
                const tr = 
                    <tr>
                        <td>${s.matricule}</td>
                        <td>${s.name}</td>
                        <td>${s.group}</td>
                        <td>
                            <button class="btn-link btn-delete" data-index="${index}">Delete</button>
                        </td>
                    </tr>;
                tbody.append(tr);
            });
        }

        renderStudents();

        $("#btnAddStudent").on("click", function () {
            const m = $("#addMatricule").val().trim();
            const n = $("#addName").val().trim();
            const g = $("#addGroup").val().trim();if (m === "" || n === "" || g === "") {
                $("#adminMsg").text("Please fill all fields.")
                    .css("background", "#fee2e2")
                    .css("color", "#b91c1c")
                    .fadeIn(150);
            } else {
                students.push({ matricule: m, name: n, group: g });
                renderStudents();
                $("#addMatricule, #addName, #addGroup").val("");
                $("#adminMsg").text("Student added (frontend demo).")
                    .css("background", "#dcfce7")
                    .css("color", "#166534")
                    .fadeIn(150);
            }

            setTimeout(function () {
                $("#adminMsg").fadeOut(250);
            }, 2500);
        });

        $(document).on("click", ".btn-delete", function () {
            const index = $(this).data("index");
            students.splice(index, 1);
            renderStudents();
        });

        $("#btnImport").on("click", function () {
            alert("Import Excel (demo – real import will be in backend).");
        });

        $("#btnExport").on("click", function () {
            alert("Export Excel (demo – real export will be in backend).");
        });
    }
});