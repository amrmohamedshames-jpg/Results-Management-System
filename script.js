
// Students List
let studentsList = [];

// Student Class
class Student {
    #grades;
    #attendance;

    constructor(id, name, grades, attendance) {
        if (!name || !name.trim()) {
            throw new Error("من فضلك أدخل اسم الطالب");
        }

        this.id = id;
        this.name = name;

        this.grades = grades;
        this.attendance = attendance;
    }

    set grades(value) {
        if (!Array.isArray(value) || value.length !== 3) {
            throw new Error("يجب إدخال درجات المواد الثلاث");
        }

        if (value.some(g => g === "" || g === null ||
            !Number.isFinite(g) || g < 0 || g > 100)) {
            throw new Error("الدرجات يجب أن تكون من 0 إلى 100");
        }

        this.#grades = [...value];
    }

    get grades() {
        return [...this.#grades];
    }

    set attendance(value) {
        if (value === "" || value === null ||
            !Number.isFinite(value) || value < 0 || value > 100) {
            throw new Error("نسبة الحضور يجب أن تكون من 0 إلى 100");
        }

        this.#attendance = value;
    }

    get attendance() {
        return this.#attendance;
    }

    getAverage() {
        return this.#grades.reduce((sum, grade) => sum + grade, 0) / 3;
    }
}

// DOM Elements
const studentName = document.getElementById("studentName");
const grade1 = document.getElementById("grade1");
const grade2 = document.getElementById("grade2");
const grade3 = document.getElementById("grade3");
const attendance = document.getElementById("attendance");

const addStudentBtn = document.getElementById("addStudentBtn");
const mercyBtn = document.getElementById("mercyBtn");

const errorBox = document.getElementById("errorBox");
const studentsDisplay = document.getElementById("studentsListDisplay");
const finalReport = document.getElementById("finalReport");

// Add Student
addStudentBtn.addEventListener("click", function () {

    try {
        const name = studentName.value.trim();

        const grades = [
            grade1.value === "" ? "" : Number(grade1.value),
            grade2.value === "" ? "" : Number(grade2.value),
            grade3.value === "" ? "" : Number(grade3.value)
        ];

        const attendanceValue = attendance.value === ""
            ? "" : Number(attendance.value);

        const student = new Student(
            Date.now(),
            name,
            grades,
            attendanceValue
        );

        studentsList.push(student);

        errorBox.textContent = "";
        errorBox.classList.add("d-none");

        const studentCard = document.createElement("div");
        studentCard.className = "alert alert-light border mb-2";

        const studentInfo = document.createElement("div");
        studentInfo.textContent =
            `الطالب: ${student.name} | المتوسط: ${student.getAverage().toFixed(2)} | الحضور: ${student.attendance}%`;

        studentCard.appendChild(studentInfo);

        studentsDisplay.querySelector("p")?.remove();
        studentsDisplay.appendChild(studentCard);

        studentName.value = "";
        grade1.value = "";
        grade2.value = "";
        grade3.value = "";
        attendance.value = "";

    } catch (error) {
        errorBox.textContent = error.message;
        errorBox.classList.remove("d-none");
    }
});

// Mercy Committee
mercyBtn.addEventListener("click", function () {

    const strugglingStudents = studentsList.filter(student => {
        const average = student.getAverage();
        return average >= 40 && average <= 49;
    });

    const updatedStudents = strugglingStudents.map(student => ({
        name: student.name,
        oldAverage: student.getAverage(),
        newAverage: student.getAverage() + 5
    }));

    const totalAverage = updatedStudents.reduce(
        (sum, student) => sum + student.newAverage, 0
    );

    const generalAverage = updatedStudents.length > 0
        ? totalAverage / updatedStudents.length
        : 0;

    if (updatedStudents.length === 0) {
        finalReport.innerHTML =
            "<div class='alert alert-info'>لا يوجد طلاب متعثرون يحتاجون إلى لجنة الرأفة.</div>";
        return;
    }

    finalReport.innerHTML = `
        <div class="alert alert-success">
            <h4>التقرير النهائي للجنة الرأفة</h4>
            <p>عدد الطلاب المتعثرين: ${updatedStudents.length}</p>

            <h5>أسماء الطلاب والنتائج:</h5>

            ${updatedStudents.map(student => `
                <div class="border rounded p-3 mb-2">
                    <strong>${student.name}</strong>
                    <p>المتوسط قبل الرأفة: ${student.oldAverage.toFixed(2)}</p>
                    <p>المتوسط بعد الرأفة: ${student.newAverage.toFixed(2)}</p>
                </div>
            `).join("")}

            <hr>
            <h5>المتوسط العام بعد الرأفة:
            ${generalAverage.toFixed(2)}</h5>
        </div>
    `;
});
