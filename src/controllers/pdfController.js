import AlunoModel from "../models/AlunoModel.js";
import { gerarPdfAluno, gerarPdfTodos } from "../utils/pdfHelper.js";

export const buscarTodos = async (req, res) => {
  try {
    const registros = await AlunoModel.buscarTodos(req.query);

    if (!registros || registros.length === 0) {
      return res
        .status(200)
        .json({ message: "Nenhum relatório de aluno encontrado." });
    }

    const pdf = await gerarPdfTodos(registros);
    return res
      .set({
        "Content-Type": "application/pdf",
        "Content-Disposition": 'inline; filename="alunos.pdf"',
      })
      .send(pdf);
  } catch (error) {
    console.error("Erro ao buscar:", error);
    return res
      .status(500)
      .json({ error: "Erro ao buscar relatório de alunos." });
  }
};

export const relatorioPorId = async (req, res) => {
  try {
    const { id } = req.params;

    if (isNaN(id)) {
      return res
        .status(400)
        .json({ error: "O ID enviado não é um número válido." });
    }

    const aluno = await AlunoModel.buscarPorId(parseInt(id));

    if (!aluno) {
      return res
        .status(404)
        .json({ error: "Registro de aluno não encontrado." });
    }

    const pdf = await gerarPdfAluno(aluno);
    return res
      .set({
        "Content-Type": "application/pdf",
        "Content-Disposition": `inline; filename="aluno_${id}.pdf"`,
      })
      .send(pdf);
  } catch (error) {
    console.error("Erro ao gerar relatório:", error);
    return res.status(500).json({ error: "Erro ao gerar relatório de aluno." });
  }
};
