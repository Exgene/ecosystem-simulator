import random
import matplotlib.pyplot as plt
import tensorflow as tf
from sklearn.preprocessing import StandardScaler
import pandas as pd
import numpy as np

all_simulation_data= []


class Species:
    def __init__(self, name, initial_population, reproduction_rate, lifespan):
        self.name = name
        self.population = initial_population
        self.reproduction_rate = reproduction_rate
        self.lifespan = lifespan

    def reproduce(self):
        return self.population * self.reproduction_rate

    def die(self):
        self.population -= 1

    def age(self):
        self.lifespan -= 1

def generate_synthetic_data(epochs,initialPlantState,initialHerbivoreState,initialCarnivoreState):
    herbivores = Species("Herbivores", initialHerbivoreState['population'], initialHerbivoreState['reproduction_rate'], initialHerbivoreState['lifespan'])
    carnivores = Species("Carnivores", initialCarnivoreState['population'], initialCarnivoreState['reproduction_rate'], initialCarnivoreState['lifespan'])
    plants = Species("Plants", initialPlantState['population'], initialPlantState['reproduction_rate'], initialPlantState['lifespan'])

    data = {'Epoch': [], 'Plants': [], 'Herbivores': [], 'Carnivores': []}

    for epoch in range(epochs):
        data['Epoch'].append(epoch)
        data['Plants'].append(plants.population)
        data['Herbivores'].append(herbivores.population)
        data['Carnivores'].append(carnivores.population)

        herbivores.population += herbivores.reproduce()
        carnivores.population += carnivores.reproduce()
        plants.population += plants.reproduce() # More significant environmental fluctuation

        herbivores.age()
        carnivores.age()
        plants.age()

        if random.random() < 0.1:
            plants.die()

        if random.random() < 0.1:
            herbivores.die()
        if random.random() < 0.05:
            carnivores.die()

        # if herbivores.population > 10 and random.random() < 0.2:
        #     herbivores.die()

    df = pd.DataFrame(data)
    return df

def train_neural_network(X_train, y_train):
    model = tf.keras.Sequential([
        tf.keras.layers.Dense(32, activation='relu', input_shape=(2,)),
        tf.keras.layers.Dense(64, activation='relu'),
        tf.keras.layers.Dense(32, activation='relu'),
        tf.keras.layers.Dense(2)  # Output layer with 2 neurons for Herbivores and Carnivores
    ])
    model.compile(optimizer='adam', loss='mse')

    # Convert NumPy arrays to TensorFlow tensors
    X_train_tf = tf.convert_to_tensor(X_train, dtype=tf.float32)
    y_train_tf = tf.convert_to_tensor(y_train, dtype=tf.float32)

    model.fit(X_train_tf, y_train_tf, epochs=100, verbose=0)

    return model

def simulate_ecosystem_with_nn(epochs,initial_plant = None,initial_herbivore=None,initial_carnivore=None):
    initialPlantState = {
    'population': 5,
    'reproduction_rate': 0.15,
    'lifespan': 5
    }

    initialHerbivoreState = {
        'population': 30,
        'reproduction_rate': 0.9,
        'lifespan': 10
    }

    initialCarnivoreState = {
        'population': 25,
        'reproduction_rate': 0.8,
        'lifespan': 8
    }
    synthetic_data = generate_synthetic_data(epochs,initialPlantState,initialHerbivoreState,initialCarnivoreState)

    # Feature scaling
    scaler = StandardScaler()
    scaled_data = scaler.fit_transform(synthetic_data[['Plants', 'Epoch']])
    scaled_data = pd.DataFrame(scaled_data, columns=['Plants', 'Epoch'])

    X_train = scaled_data[['Plants', 'Epoch']].values
    y_train = synthetic_data[['Herbivores', 'Carnivores']].values

    # Train the neural network
    model = train_neural_network(X_train, y_train)

    # Simulation
    herbivores_population = []
    carnivores_population = []
    plants_population = []

    herbivores = Species("Herbivores", initialHerbivoreState['population'], initialHerbivoreState['reproduction_rate'], initialHerbivoreState['lifespan'])
    carnivores = Species("Carnivores", initialCarnivoreState['population'], initialCarnivoreState['reproduction_rate'], initialCarnivoreState['lifespan'])
    plants = Species("Plants", initialPlantState['population'], initialPlantState['reproduction_rate'], initialPlantState['lifespan'])

    for epoch in range(epochs):
        input_features = scaler.transform([[plants.population, epoch]])[0]
        input_features = np.array(input_features).reshape(1, -1)
        predicted_populations = model.predict(input_features)[0]

        herbivores.population += predicted_populations[0]
        carnivores.population += predicted_populations[1]
        plants.population += plants.reproduce() + random.randint(-15, 15)

        herbivores.age()
        carnivores.age()
        plants.age()

        if epoch % 10 == 0:
            plants.population += random.randint(-30, 30)

        if random.random() < 24:
            plants.die()

        if random.random() < 0.1:
            herbivores.die()
        if random.random() < 0.05:
            carnivores.die()

        if herbivores.population > 10 and random.random() < 0.2:
            herbivores.die()

        herbivores_population.append(herbivores.population)
        carnivores_population.append(carnivores.population)
        plants_population.append(plants.population)

        epoch_data = {
            'epoch': epoch,
            'herbivores_population': herbivores.population,
            'carnivores_population': carnivores.population,
            'plants_population': plants.population,
        }

        all_simulation_data.append(epoch_data)
    
    return {"data":all_simulation_data,"initial_plant":initialPlantState,"initial_herbivore":initialHerbivoreState,"initial_carnivore":initialCarnivoreState}
    # Plotting the simulation results
        # plt.figure(figsize=(12, 6))

        # plt.subplot(2, 1, 1)
        # plt.plot(range(epoch + 1), herbivores_population, label=f"Herbivores (Epoch {epoch + 1})")
        # plt.plot(range(epoch + 1), carnivores_population, label=f"Carnivores (Epoch {epoch + 1})")
        # plt.plot(range(epoch + 1), plants_population, label=f"Plants (Epoch {epoch + 1})")
        # plt.xlabel("Epochs")
        # plt.ylabel("Population")
        # plt.legend()

        # plt.subplot(2, 1, 2)
        # plt.plot(range(epoch + 1), synthetic_data['Herbivores'][:epoch + 1], label="Actual Herbivores", linestyle='--')
        # plt.plot(range(epoch + 1), synthetic_data['Carnivores'][:epoch + 1], label="Actual Carnivores", linestyle='--')
        # plt.xlabel("Epochs")
        # plt.ylabel("Population")
        # plt.legend()

        # plt.tight_layout()
        # plt.show()


# Run the simulation with neural networks for 50 epochs
# simulate_ecosystem_with_nn(20)
