import htmlPdf from "html-pdf-node";
import fs from "fs";

export async function gerarPdfAluno(aluno) {
  let fotoHtml = "Não há registros de foto";

  if (aluno.foto) {
    const base64 = fs.readFileSync(aluno.foto).toString("base64");
    fotoHtml = `<img src="data:image/jpeg;base64,${base64}" width="120"/>`;
  }

  const html = `
    <html>
    <body>
        <h1>Relatório do Aluno</h1>

        <p>Foto: ${fotoHtml}</p>
        <p>Nome: ${aluno.nome}</p>
        <p>Escola: ${aluno.escola || "Aluno não está registrado em uma escola"}</p>
        <p>Turma: ${aluno.turma || "Turma não identificada"}</p>
    </body>
    </html>
    `;

  return htmlPdf.generatePdf({ content: html }, { format: "A4" });
}

export async function gerarPdfTodos(alunos) {
  const linhas = alunos
    .map(
      (a) => `
            <tr>
                <td>${a.nome}</td>
                <td>${a.escola || "Sem escola"}</td>
                <td>${a.turma || "Sem turma"}</td>
                <td>${a.foto || "Sem foto"}</td>
            </tr>
        `,
    )
    .join("");

  const html = `
    <h1 style="text-align: center;"> Relatório de alunos </h1>

    <table border="1" cellspacing="0" cellspacing="8">
        <tr>
            <th>Nome</th>
            <th>Escola</th>
            <th>Turma</th>
            <th>Foto</th>
        </tr>
            ${linhas}
    </table>
    <p>Total: ${alunos.length} alunos</p>
  `;

  return htmlPdf.generatePdf({ content: html }, { format: "A4" });
}
