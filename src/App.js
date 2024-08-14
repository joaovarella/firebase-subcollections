import { useState, useEffect } from "react";
import Banner from "./componentes/Banner";
import Formulario from "./componentes/Formulario";
import Rodape from "./componentes/Rodape";
import Time from "./componentes/Time";
import {
  collection,
  deleteDoc,
  doc,
  Firestore,
  getDoc,
  getDocs,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";
import { db } from "./firebase/firebase";

function App() {
  const [times, setTimes] = useState([]);

  const [colaboradores, setColaboradores] = useState([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "times"), (snapshot) => {
      const timesArray = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTimes(timesArray);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchTimesAndEmployees = async () => {
      // Obtém todos os documentos na coleção "times"
      const timesSnapshot = await getDocs(collection(db, "times"));

      const unsubscribes = timesSnapshot.docs.map((timeDoc) => {
        const timeData = timeDoc.data();
        const timeId = timeDoc.id;

        // Configura o onSnapshot para monitorar a subcoleção "funcionarios" para cada time
        return onSnapshot(
          collection(db, "times", timeId, "funcionarios"),
          (funcionariosSnapshot) => {
            const allColaboradores = [];

            funcionariosSnapshot.forEach((funcionarioDoc) => {
              allColaboradores.push({
                timeId,
                timeNome: timeData.nome,
                timeCor: timeData.cor,
                funcionarioId: funcionarioDoc.id,
                ...funcionarioDoc.data(),
              });
            });

            // Atualiza o estado com os colaboradores coletados
            setColaboradores((prevColaboradores) => {
              // Filtra os colaboradores antigos do time atual para evitar duplicação
              const filteredColaboradores = prevColaboradores.filter(
                (colaborador) => colaborador.timeId !== timeId
              );
              return [...filteredColaboradores, ...allColaboradores];
            });
          }
        );
      });
      // Retorna uma função de limpeza que cancela todos os snapshots
      return () => {
        unsubscribes.forEach((unsubscribe) => unsubscribe());
      };
    };

    fetchTimesAndEmployees();
  }, []);

  async function deletarColaborador(colaboradorid, timeId) {
    try {
      const funcionarioRef = doc(
        db,
        `times/${timeId}/funcionarios/${colaboradorid}`
      );

      await deleteDoc(funcionarioRef);
      console.log("Documento da subcoleção excluído com sucesso!");
    } catch (error) {
      console.error("Erro ao excluir documento:", error);
    }
  }

  async function mudaCorDoTime(cor, id) {
    const colaboradorRef = doc(db, `times/${id}`);
    await updateDoc(colaboradorRef, { cor: `${cor}` });
    console.log(`Time com ID ${id} foi atualizado a cor para ${cor}.`);
  }

  async function resolverFavorito(timeId, colaboradorId) {
    try {
      const funcionarioRef = doc(
        db,
        `times/${timeId}/funcionarios/${colaboradorId}`
      );
      let favorito;
      colaboradores.filter((colaborador) => {
        if (colaborador.funcionarioId === colaboradorId) {
          favorito = !colaborador.favorito;
        }
      });

      // Atualize o documento com o novo valor
      await updateDoc(funcionarioRef, { favorito: favorito });
      console.log("Funcionário favoritado com sucesso!");
    } catch (error) {
      console.error("Erro ao favoritar documento:", error);
    }
  }

  function chamarColaboradores() {
    console.log(colaboradores);
    console.log(times);
  }

  return (
    <div>
      <Banner />
      <Formulario
        times={times.map((time) => time.nome)}
        aoCadastrar={(colaborador) =>
          setColaboradores([...colaboradores, colaborador])
        }
      />

      <section className="times">
        <h1>Minha organização</h1>
        <button onClick={chamarColaboradores}>Teste</button>
        {times.map((time, indice) => (
          <Time
            key={indice}
            time={time}
            colaboradores={colaboradores.filter(
              (colaborador) => colaborador.timeId === time.id
            )}
            aoDeletar={deletarColaborador}
            mudarCor={mudaCorDoTime}
            favoritar={resolverFavorito}
          />
        ))}
      </section>
      <Rodape />
    </div>
  );
}

export default App;
