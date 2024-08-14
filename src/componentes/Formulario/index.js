import { useState } from "react";
import Botao from "../Botao";
import Campo from "../Campo";
import ListaSuspensa from "../ListaSuspensa";
import "./formulario.css";
import { db } from "../../firebase/firebase";
import {
  doc,
  updateDoc,
  getDoc,
  setDoc,
  addDoc,
  where,
  query,
  collection,
  getDocs,
} from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";

const Formulario = ({ times }) => {
  const [nome, setNome] = useState("");
  const [cargo, setCargo] = useState("");
  const [imagem, setImagem] = useState("");
  const [time, setTime] = useState("");

  const [nomeTime, setNomeTime] = useState("");
  const [corTime, setCorTime] = useState("");

  const aoSubmeter = async (evento) => {
    evento.preventDefault();

    const q = query(collection(db, "times"), where("nome", "==", time));

    try {
      // Executa a consulta e obtém os documentos
      const querySnapshot = await getDocs(q);

      // Verifica se algum documento foi encontrado
      if (querySnapshot.empty) {
        console.log("Nenhum documento encontrado com o nome especificado.");
        return;
      }

      console.log(querySnapshot);
      // Obtém a referência ao primeiro documento encontrado
      const docRef = querySnapshot.docs[0].ref;

      // Adiciona uma subcoleção ao documento encontrado
      const subcollectionRef = collection(docRef, "funcionarios"); // Nome da subcoleção

      // Dados que você deseja adicionar à subcoleção
      const novoFuncionario = {
        nome,
        cargo,
        imagem,
        time,
      };

      // Referência ao novo documento na subcoleção com um ID gerado automaticamente
      const newDocRef = doc(subcollectionRef, uuidv4());

      // Adiciona o novo documento à subcoleção
      await setDoc(newDocRef, novoFuncionario);

      console.log("Documento adicionado à subcoleção com sucesso!");
    } catch (error) {
      console.error("Erro ao buscar ou adicionar documento:", error);
    }
  };

  const criarTime = async (evento) => {
    evento.preventDefault();
    const userDocRef = doc(db, "times", uuidv4());
    await setDoc(userDocRef, {
      nome: nomeTime,
      cor: `${corTime}`,
    });
  };

  return (
    <section className="formulario-container">
      <form className="formulario formulario1" onSubmit={aoSubmeter}>
        <h2>Preencha os dados para criar o card do colaborador.</h2>
        <Campo
          obrigatorio={true}
          label="Nome"
          placeholder="Digite seu nome "
          valor={nome}
          aoAlterado={(valor) => setNome(valor)}
        />
        <Campo
          obrigatorio={true}
          label="Cargo"
          placeholder="Digite seu cargo "
          valor={cargo}
          aoAlterado={(valor) => setCargo(valor)}
        />
        <Campo
          label="Imagem"
          placeholder="Informe o endereço da imagem "
          aoAlterado={(valor) => setImagem(valor)}
        />
        <ListaSuspensa
          obrigatorio={true}
          label="Times"
          items={times}
          valor={time}
          aoAlterado={(valor) => setTime(valor)}
        />
        <Botao texto="Criar card" />
      </form>

      <form className="formulario formulario2" onSubmit={criarTime}>
        <h2>Preencha os dados para criar um novo time.</h2>
        <Campo
          obrigatorio={true}
          label="Nome"
          placeholder="Digite seu nome"
          valor={nomeTime}
          aoAlterado={(valor) => setNomeTime(valor)}
        />
        <Campo
          obrigatorio={true}
          type="color"
          label="Cor"
          placeholder="Digite a cor do time"
          valor={corTime}
          aoAlterado={(valor) => setCorTime(valor)}
        />
        <Botao texto="Criar time" />
      </form>
    </section>
  );
};

export default Formulario;
