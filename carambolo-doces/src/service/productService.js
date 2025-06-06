import { axiosApi } from "../provider/AxiosApi"


export const findAllFornada = async () => {
    try {
        const fornadas = await axiosApi.get(`/fornadas`);

        const lastFornada = fornadas.data[fornadas.data.length - 1];

        const products = await axiosApi.get(`/fornadas/da-vez/produtos?data_inicio=${lastFornada.dataInicio}&data_fim=${lastFornada.dataFim}`);
        console.log(products.data)
        return products.data;
    } catch (error) {
        console.log(error)
    }
}

export const findAllBolo = () => {
    const response = axiosApi.get(`/fornadas/bolos`, {
        headers: {
            Authorization: `Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiI1NTExOTkxMTE3NzM0IiwiaWF0IjoxNzQ4OTAzMzY2LCJleHAiOjE3NTI1MDMzNjZ9.nKKQR_e9NfSIiTc0uUMpG4Di2_aarkgP0pK-t5kyT-c2bvwQpg4urQDloWXT2VemKJ95e_NJXX3LY2pfoXNygw`
        }
    })
}