import { api } from "src/boot/axios";

export const getStudentsTestResults = async (idTest: string, idCourseForStudentsResults: string) => {
	const response = await api.get("/students-test-results", {
		params: {
			idTest,
			idCourse: idCourseForStudentsResults,
		},
	});
	return response.data;
};

export const getStudentsOnCourse = async (idCourse: string, idAcademicYear: string) => {
	const response = await api.get("/students-on-course", {
		params: {
			idCourse,
			idAcademicYear,
		},
	});
	return response.data;
};
