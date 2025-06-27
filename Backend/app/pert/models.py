from typing import List, Dict, Union, Optional
import math
from scipy.stats import norm

class Activity:
    def __init__(self, name: str, precedents: Optional[List[str]] = None, cost: float = 0.0, acceleration: Optional[int] = None, acceleration_cost: Optional[float] = None, optimist: Optional[float] = None, probable: float = 0.0, pessimist: Optional[float] = None):
        self.name = name
        self.precedents = precedents if precedents is not None else []
        self.cost = cost
        self.acceleration = acceleration
        self.acceleration_cost = acceleration_cost
        self.optimist = optimist
        self.probable = probable
        self.pessimist = pessimist
        self.average_time = self.calculate_average_time()
        self.variance = self.calculate_variance()

    def calculate_average_time(self) -> float:
        if self.optimist is not None and self.pessimist is not None:
            return round((self.optimist + 4 * self.probable + self.pessimist) / 6, 2)
        return self.probable

    def calculate_variance(self) -> float:
        if self.optimist is not None and self.pessimist is not None and self.optimist != self.pessimist:
            return round(((self.pessimist - self.optimist) / 6) ** 2, 2)
        return 0.027

    def to_dict_table(self) -> Dict[str, Union[str, List[str], float]]:
        return {
            'name': self.name,
            'precedents': self.precedents,
            'average_time': self.average_time,
            'variance': self.variance,
            'cost': self.cost
        }

    def __repr__(self):
        return f"Activity(name={self.name}, avg_time={self.average_time}, variance={self.calculate_variance()})"

    @staticmethod
    def calculate_table(activities: List['Activity']) -> List[Dict[str, Union[str, List[str], float]]]:
        return [activity.to_dict_table() for activity in activities]

class PERTCalculator:
    def __init__(self, activities: List[Activity], expected_time: float):
        self.activities = activities
        self.activity_dict = {activity.name: activity for activity in self.activities}
        self.expected_time = expected_time
        self.critical_path = []
        self.earliest_start = {}
        self.earliest_finish = {}
        self.latest_start = {}
        self.latest_finish = {}
        self.slack = {}
        self.routes_with_times = []
        self.probability = 0

    def calculate_pert(self):
        self._forward_pass()
        self._backward_pass()
        self._calculate_slack()
        self._determine_critical_path()
        self._calculate_routes()

    def _forward_pass(self):
        for activity in self.activities:
            if not activity.precedents:
                self.earliest_start[activity.name] = 0
            else:
                max_precedent_finish = max(self.earliest_finish[p] for p in activity.precedents)
                self.earliest_start[activity.name] = max_precedent_finish
            self.earliest_finish[activity.name] = round(self.earliest_start[activity.name] + activity.average_time, 2)

    def _backward_pass(self):
        max_finish_time = max(self.earliest_finish.values(), default=0)
        successors = {activity.name: [] for activity in self.activities}
        for activity in self.activities:
            for precedent in activity.precedents:
                successors[precedent].append(activity.name)

        for activity in reversed(self.activities):
            if not successors[activity.name]:
                self.latest_finish[activity.name] = max_finish_time
            else:
                min_successor_start = min(self.latest_start[s] for s in successors[activity.name])
                self.latest_finish[activity.name] = min_successor_start
            self.latest_start[activity.name] = round(self.latest_finish[activity.name] - activity.average_time, 2)

    def _calculate_slack(self):
        for activity in self.activities:
            self.slack[activity.name] = self.latest_start[activity.name] - self.earliest_start[activity.name]

    def _determine_critical_path(self):
        for activity in self.activities:
            self.slack[activity.name] = self.latest_start[activity.name] - self.earliest_start[activity.name]
            if self.slack[activity.name] == 0:
                self.critical_path.append(activity.name)

    def _find_all_routes(self, current_route, current_activity, routes_with_times, end_activities):
        current_route.append(current_activity)
        if current_activity in end_activities:
            route_time = round(sum(self.activity_dict[activity].average_time for activity in current_route), 2)
            routes_with_times.append((list(current_route), route_time))
        else:
            for activity in self.activities:
                if current_activity in activity.precedents:
                    self._find_all_routes(current_route, activity.name, routes_with_times, end_activities)
        current_route.pop()

    def _calculate_routes(self):
        start_activities = [activity.name for activity in self.activities if not activity.precedents]
        end_activities = [activity.name for activity in self.activities if all(activity.name not in a.precedents for a in self.activities)]

        routes_with_times = []
        for start in start_activities:
            self._find_all_routes([], start, routes_with_times, end_activities)

        self.routes_with_times = [{'route': route, 'completion_time': time, 'critical': time > self.expected_time} for route, time in routes_with_times]

    def get_project_duration(self):
        return max(route['completion_time'] for route in self.routes_with_times)

    def calculate_completion_probability(self):
        min_completion_time = self.get_project_duration()
        variance_total = round(sum(self.activity_dict[activity].calculate_variance() for activity in self.critical_path),2)
        std_dev_total = math.sqrt(variance_total)
        Z = (min_completion_time - self.expected_time) / std_dev_total
        probability = norm.cdf(Z)
        self.probability = probability
        return {"varianza total": variance_total, "min_completion_time": min_completion_time, "Z_score": round(Z, 2), "completion_probability": round(probability * 100, 2), "critical path": min_completion_time}

    def get_activity_times(self):
        return [
            {
                'name': activity.name,
                'earliest_start': round(self.earliest_start[activity.name], 2),
                'earliest_finish': round(self.earliest_finish[activity.name], 2),
                'latest_start': round(self.latest_start[activity.name], 2),
                'latest_finish': round(self.latest_finish[activity.name], 2),
                'slack': round(self.slack[activity.name], 2)
            } for activity in self.activities
        ]

    def optimize_until_expected(self):
        """
        Optimiza iterativamente la red PERT acelerando actividades de la ruta crítica (slack = 0),
        recalculando la red en cada iteración, hasta que la duración total del proyecto sea
        menor o igual al tiempo esperado o no se pueda acelerar más.
        """
        total_acceleration_cost = 0
        optimized_activities = []
        iteration = 0
        max_iterations = 50  # Para evitar loops infinitos

        # Se asume que self.calculate_pert() ya fue llamado una vez antes
        while self.get_project_duration() > self.expected_time and iteration < max_iterations:
            iteration += 1

            # Recalcular la red PERT (forward, backward, slack, ruta crítica)
            self.calculate_pert()
            current_duration = self.get_project_duration()
            reduction_needed = round(current_duration - self.expected_time, 2)
            if reduction_needed <= 0:
                break

            # Seleccionar solo actividades verdaderamente críticas: slack == 0 y que puedan acelerarse
            critical_activities = [
                act for act in self.activities
                if self.slack[act.name] == 0 and act.acceleration and act.acceleration_cost
            ]
            if not critical_activities:
                # No se pueden acelerar más
                break

            # Seleccionar la actividad con menor costo de aceleración por unidad
            candidate = min(critical_activities, key=lambda act: act.acceleration_cost)
            # Cuánto se puede reducir en esta actividad (no más de lo permitido por su capacidad y lo que se necesita)
            reduction = round(min(candidate.acceleration, reduction_needed), 2)
            if reduction <= 0:
                break

            cost = round(reduction * candidate.acceleration_cost, 2)
            total_acceleration_cost += cost
            optimized_activities.append({
                "activity": candidate.name,
                "time_reduced": reduction,
                "acceleration_cost_per_unit": candidate.acceleration_cost,
                "total_acceleration_cost": cost
            })

            # Aplicar la aceleración: reducimos el tiempo (por ejemplo, disminuyendo optimist, probable y pessimist)
            # Esto asume que la aceleración reduce todos los tiempos de la actividad
            candidate.probable = candidate.probable - reduction
            if candidate.optimist is not None:
                candidate.optimist = candidate.optimist - reduction
            if candidate.pessimist is not None:
                candidate.pessimist = candidate.pessimist - reduction

            # Reducir la capacidad de aceleración disponible para la actividad
            candidate.acceleration = round(candidate.acceleration - reduction, 2)
            # Recalcular el tiempo promedio de la actividad
            candidate.average_time = candidate.calculate_average_time()

        # Recalcular la red final
        self.calculate_pert()

        return {
            "activities": optimized_activities,
            "total_acceleration_cost": total_acceleration_cost,
            "final_project_duration": self.get_project_duration()
        }
