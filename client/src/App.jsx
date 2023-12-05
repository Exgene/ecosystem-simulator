import { Suspense, useEffect, useState } from "react";
import { Bar, BarChart, Legend, Tooltip, XAxis, YAxis } from "recharts";
import "./App.css";
import GraphComponent from "./components/GraphComponent";

function App() {
  const [alldata, setAlldata] = useState([]);
  const [generated, setGenerated] = useState(false);
  const [initial, setInitial] = useState([]);
  const [plants_value, setPlants] = useState([]);
  const [herbi_value, setherbi] = useState([]);
  const [carni_value, setcarni] = useState([]);

  async function sendData() {
    const response = await fetch("http://127.0.0.1:8080/api/main", {
      method: "POST",
      body: JSON.stringify({
        message: "Send Me that nice juicy data please :((((((",
      }),
      headers: {
        "Content-Type": "application/json", // Set the content type to JSON
      },
    });
    const data = await response.json();
    const finalData = data.returnData.data;
    setAlldata(finalData);
    const plant = finalData.map((item) => {
      return {
        epochs: item.epoch,
        plants: item.plants_population,
      };
    });
    const herbi = finalData.map((item) => {
      return {
        epochs: item.epoch,
        herbivore: item.herbivores_population,
      };
    });
    setherbi(herbi);
    const carni = finalData.map((item) => {
      return {
        epochs: item.epoch,
        carnivore: item.carnivores_population,
      };
    });

    const initialD = [];
    initialD.push(data.returnData.initial_plant);
    initialD.push(data.returnData.initial_herbivore);
    initialD.push(data.returnData.initial_carnivore);
    setInitial(initialD);
    setcarni(carni);
    setPlants(plant);
  }

  const initialFN = async (
    initial_plant,
    initial_herbivore,
    initial_carnivore
  ) => {
    const response = await fetch("http://127.0.0.1:8080/api/main", {
      method: "POST",
      body: JSON.stringify({
        message: "Send Me that nice juicy data please :((((((",
        initial_plant: initial_plant,
        initial_herbivore: initial_herbivore,
        initial_carnivore: initial_carnivore,
      }),
      headers: {
        "Content-Type": "application/json", // Set the content type to JSON
      },
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const initial_plant = [];
    const initial_herbivore = [];
    const initial_carnivore = [];
    const plant = document.getElementsByName("plant");
    const herbivore = document.getElementsByName("herbivore");
    const carnivore = document.getElementsByName("carnivore");
    for (let i = 0; i < plant.length; i++) {
      if (plant[i].value) {
        initial_plant.push(plant[i].value);
      }
    }
    for (let i = 0; i < herbivore.length; i++) {
      if (herbivore[i].value) {
        initial_herbivore.push(herbivore[i].value);
      }
    }
    for (let i = 0; i < carnivore.length; i++) {
      if (carnivore[i].value) {
        initial_carnivore.push(carnivore[i].value);
      }
    }
    initialFN(initial_plant, initial_herbivore, initial_carnivore);
  };
  useEffect(() => {
    sendData(); // Call sendData when the component mounts
  }, []);
  return (
    <>
      <button
        onClick={() => {
          setGenerated(true);
          if (generated) {
            sendData();
          }
        }}
      >
        Run
      </button>
      <div>
        {generated ? (
          <>
            <h2>Graphs:</h2>

            <div className="main-container">
              <Suspense
                fallback={() => {
                  <div>Loading....</div>;
                }}
              >
                <GraphComponent
                  xKey="plants_population"
                  lineKey="plants"
                  data={plants_value}
                />
              </Suspense>
              <Suspense
                fallback={() => {
                  <div>Loading....</div>;
                }}
              >
                <GraphComponent
                  xKey="herbivores_population"
                  lineKey="herbivore"
                  data={herbi_value}
                />
              </Suspense>
              <Suspense
                fallback={() => {
                  <div>Loading....</div>;
                }}
              >
                <GraphComponent
                  xKey="carnivores_population"
                  lineKey="carnivore"
                  data={carni_value}
                />
              </Suspense>
            </div>
            <h2>Initial Values:</h2>
            <div className="initial">
              <div>
                <h2>Plants: </h2>
                <h4>LifeSpan : {initial[0].lifespan}</h4>
                <h4>ReproductionRate : {initial[0].reproduction_rate}</h4>
                <h4>Population : {initial[0].population}</h4>
              </div>
              <div>
                <h2>Herbivores: </h2>
                <h4>LifeSpan : {initial[1].lifespan}</h4>
                <h4>ReproductionRate : {initial[1].reproduction_rate}</h4>
                <h4>Population : {initial[1].population}</h4>
              </div>
              <div>
                <h2>Carnivore: </h2>
                <h4>LifeSpan : {initial[2].lifespan}</h4>
                <h4>ReproductionRate : {initial[2].reproduction_rate}</h4>
                <h4>Population : {initial[2].population}</h4>
              </div>
              <BarChart width={730} height={250} data={alldata}>
                {/* <CartesianGrid strokeDasharray="3 3" /> */}
                <XAxis dataKey="" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="plants_population" fill="#82ca9d" />
                <Bar dataKey="herbivores_population" fill="#8884d8" />
                <Bar dataKey="carnivores_population" fill="#e1777e" />
              </BarChart>
            </div>
            {/* <form action="post" onSubmit={handleSubmit}>
              <input
                type="number"
                name="plant"
                id="plant"
                placeholder="plant-lifespan"
              />
              <input
                type="number"
                name="plant"
                id="plant"
                placeholder="plant-reproduction_rate"
              />
              <input
                type="number"
                name="plant"
                id="plant"
                placeholder="plant-population"
              />
              <input
                type="number"
                name="herbivore"
                id="herbivore"
                placeholder="herbivore-lifespan"
              />
              <input
                type="number"
                name="herbivore"
                id="herbivore"
                placeholder="herbivore-reproduction_rate"
              />
              <input
                type="number"
                name="herbivore"
                id="herbivore"
                placeholder="herbivore-population"
              />
              <input
                type="number"
                name="carnivore"
                id="carnivore"
                placeholder="carnivore-lifespan"
              />
              <input
                type="number"
                name="carnivore"
                id="carnivore"
                placeholder="carnivore-reproduction_rate"
              />
              <input
                type="number"
                name="carnivore"
                id="carnivore"
                placeholder="carnivore-population"
              />
              <input type="submit" value="Submit" id="submit" />
            </form> */}
          </>
        ) : (
          <div>
            <h1>Click Here to start the simulation of species!</h1>
          </div>
        )}
      </div>
      {/* <div>Hello</div> */}
    </>
  );
}

export default App;
