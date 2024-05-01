import { api } from "src/boot/axios";

export const getTestLogDetails = async (idTestInstance: string) => {
	const response = await api.get("/testlogdetails", {
		params: {
			idTestInstance,
		},
	});
	return response.data;
};
