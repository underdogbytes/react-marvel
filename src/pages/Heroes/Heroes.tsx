import { useEffect, useState } from "react";
import { useHeroesGetAll } from "../../api/heroes";
import lupa from "../../assets/icons/lupa.png";
import { Loading } from "../../components/Loading";
import { Pagination } from "../../components/Pagination/Pagination";
import { RowHero } from "./components";
import { Modal } from "./components/Modal";
import "./index.css";

export function HeroesPage() {
  const [offset, setOffset] = useState(0);
  const { heroes, loading, error, fetchHeroes } = useHeroesGetAll();
  const [nameFilter, setNameFilter] = useState("");
  const [modal, setModal] = useState(false);
  const [hero, setHero] = useState({});

  if (error) {
    alert(`Erro inesperado! Tente novamente mais tarde :(\n\n${error}`);
  }

  useEffect(() => {
    fetchHeroes(offset, nameFilter);
  }, [offset]);
  
  const handleSearch = () => {
    setOffset(0);
    fetchHeroes(0, nameFilter);
  };

  const openModal = (id: number) => {
    let hero = heroes?.results.filter((item) => item.id === id)
    let hardCopy = Object.assign({}, hero);
    setModal(true);
    setHero(hardCopy[0])
  }

  const closeModal = () => {
    setModal(false);
  }

  return (
    <>
      {loading ? 
        (<Loading status={loading} />)
        :
        (
          <>
            <header>
              <h1>Busca de personagens</h1>

              <form className="form--heroes__search">
                <label>Nome do personagem</label>
                <div className="form--heroes__search__input-btn">
                  <input
                    type="text"
                    placeholder="Buscar"
                    value={nameFilter}
                    onChange={(event) => setNameFilter(event.target.value)}
                  />
                  <button style={{ backgroundImage: `url(${lupa})`}} onClick={handleSearch}></button>
                </div>
              </form>
            </header>
            <table className="table--heroes">
              <thead>
                <tr>
                  <th>Personagem</th>
                  <th>Séries</th>
                  <th>Eventos</th>
                </tr>
              </thead>
              <tbody>
                {heroes && heroes.results.length > 0 ? (
                  heroes.results.map((element, index) => (
                    <RowHero
                      key={index}
                      heroData={element as any}
                      getModal={openModal}
                    />
                  ))
                ) : <></>}
              </tbody>
            </table>
            {heroes && heroes.results.length > 0 ? (
              <Pagination
                limit={heroes.limit}
                total={heroes.total}
                offset={offset}
                setOffset={setOffset}
              />
            ) : <></>}

            {modal ? <Modal hero={hero} changeStatus={closeModal} /> : <></>}
          </>
        )
      }
    </>
  )
}