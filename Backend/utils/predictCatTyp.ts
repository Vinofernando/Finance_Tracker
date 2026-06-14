import dotenv from "dotenv";
dotenv.config();

const ML_PRIVATE_NETWORK = process.env.ML_PRIVATE_NETWORK;

export default async function predictCatTyp(desc: string) {
  try {
    if (!desc) {
      throw { success: "false", message: "Desc harus diisi" };
    }

    if (!ML_PRIVATE_NETWORK) {
      throw new Error("ML NETWORK not defined in environment variables");
    }
    const response = await fetch(ML_PRIVATE_NETWORK, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        deskripsi: desc,
      }),
    });

    const data = await response.json();
    console.log(data);

    return {
      status: "Sucess",
      kategori_otomatis: data.kategori_otomatis,
      type_otomatis: data.type_otomatis,
    };
  } catch (err) {
    console.error("error,", err);
  }
}
