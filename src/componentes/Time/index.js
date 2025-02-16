import hexToRgba from "hex-to-rgba";
import Colaborador from "../Colaborador";
import "./time.css";

const Time = ({ time, colaboradores, aoDeletar, mudarCor, favoritar }) => {
  return (
    colaboradores.length > 0 && (
      <section
        className="time"
        style={{
          backgroundImage: "url(/imagens/fundo.png)",
          backgroundColor: hexToRgba(time.cor, "0.6"),
        }}
      >
        <input
          type="color"
          onChange={(evento) => mudarCor(evento.target.value, time.id)}
          className="input-cor"
        />
        <h3 style={{ borderColor: time.cor }}>{time.nome}</h3>
        <div className="colaboradores">
          {colaboradores.map((colaborador, indice) => (
            <Colaborador
              key={indice}
              colaborador={colaborador}
              corDeFundo={time.cor}
              aoDeletar={aoDeletar}
              aoFavoritar={favoritar}
            />
          ))}
        </div>
      </section>
    )
  );
};

export default Time;
