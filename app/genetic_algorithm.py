import numpy as np
from deap import base, creator, tools, algorithms
import random

# Define fitness criteria and individual structure
creator.create("FitnessMin", base.Fitness, weights=(-1.0, -1.0))  # Minimize time and energy
creator.create("Individual", list, fitness=creator.FitnessMin)

def calculate_distance(point1, point2):
    return np.linalg.norm(np.array(point1) - np.array(point2))

def evaluate(individual, delivery_points):
    total_distance = 0
    total_time = 0
    total_energy = 0

    for i in range(len(individual) - 1):
        point1 = delivery_points[individual[i]]
        point2 = delivery_points[individual[i + 1]]
        dist = calculate_distance(point1, point2)
        
        total_distance += dist
        total_time += dist / 10  # assuming drone speed is 10 units per time
        total_energy += dist * 0.1  # assuming drone energy consumption is 0.1 per unit distance

    return total_time, total_energy

def create_individual(delivery_points):
    return random.sample(range(len(delivery_points)), len(delivery_points))

def create_toolbox(delivery_points):
    toolbox = base.Toolbox()
    toolbox.register("individual", tools.initIterate, creator.Individual, lambda: create_individual(delivery_points))
    toolbox.register("population", tools.initRepeat, list, toolbox.individual)
    toolbox.register("mate", tools.cxOrdered)
    toolbox.register("mutate", tools.mutShuffleIndexes, indpb=0.05)
    toolbox.register("select", tools.selTournament, tournsize=3)
    toolbox.register("evaluate", evaluate, delivery_points=delivery_points)
    return toolbox

def run_genetic_algorithm(delivery_points):
    toolbox = create_toolbox(delivery_points)
    population = toolbox.population(n=50)
    algorithms.eaSimple(population, toolbox, cxpb=0.7, mutpb=0.2, ngen=50, verbose=True)
    best_individual = tools.selBest(population, 1)[0]
    return best_individual

if __name__ == "__main__":
    # Example static delivery points
    delivery_points = np.array([[0, 0], [1, 2], [3, 4], [5, 6], [7, 8]])
    best_route = run_genetic_algorithm(delivery_points)
    print(f"Best route: {best_route}")
