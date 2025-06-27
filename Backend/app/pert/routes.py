from flask import Blueprint, jsonify, request
from .models import PERTCalculator, Activity
import openai
from dotenv import load_dotenv

bp = Blueprint('main', __name__)

@bp.route('/api/v1.0/calculatePert', methods=['POST'])
def calculate_pert_route():
    try:
        data = request.json
        activities_data = data.get('activities', [])
        expected_time = data.get('expected_time', 0)

        # Crear instancias de Activity a partir de los datos recibidos
        activities = [Activity(**act) for act in activities_data]

        # Calcular los tiempos PERT
        pert_calculator = PERTCalculator(activities, expected_time)
        pert_calculator.calculate_pert()

        # Calcular la tabla y las rutas
        routes = pert_calculator.routes_with_times
        activity_times = pert_calculator.get_activity_times()
        table = Activity.calculate_table(activities)
        probability = pert_calculator.calculate_completion_probability()
        critical_path = pert_calculator.critical_path

        # Calcular optimización de la ruta crítica
        optimization_result = pert_calculator.optimize_until_expected()

        # Calcular el costo total del proyecto
        total_project_cost = sum(activity.cost for activity in activities)

        # Preparar datos para ChatGPT
        prompt = f"""
        Eres un experto en gestión de proyectos y análisis PERT. Con base en los siguientes datos, proporciona un análisis detallado del estado del proyecto, identificando posibles riesgos, áreas de mejora y recomendaciones estratégicas.
        - Tabla de actividades: {table}
        - Costo total planeado: {total_project_cost}
        - Probabilidad de finalización: {probability}
        - Ruta crítica: {critical_path}
        - Rutas del proyecto: {routes}
        - Actividades a optimizar: {optimization_result}
        - Tiempos tardíos y tempranos del proyecto: {activity_times}
        Instrucciones para la interpretación:
        Evaluación del presupuesto: Analiza si el costo total planeado parece adecuado en función de la tabla de actividades y si puede haber riesgos de sobrecostos.
        Análisis del tiempo y probabilidad de finalización: Evalúa si la probabilidad de finalización es suficiente y si hay riesgos de retraso.
        Análisis de la ruta crítica: Explica su impacto en el tiempo total del proyecto y si hay margen de ajuste.
        Optimización del proyecto: Identifica qué actividades pueden optimizarse y cómo esto afectaría los costos y tiempos.
        Conclusión y recomendaciones: Sugiere estrategias para mejorar la gestión del proyecto, reducir costos y minimizar riesgos.
        """

        # Llamar a la API de OpenAI
        client = openai.OpenAI(api_key)
        response_ai = client.chat.completions.create(
            model="gpt-4",
            messages=[
                {"role": "system", "content": "Eres un experto en gestión de proyectos y costos."},
                {"role": "user", "content": prompt}
            ]
        )

        ai_analysis = response_ai.choices[0].message.content

        response = {
            'routes': routes,
            'table': table,
            'activity_times': activity_times,
            'probability': probability,
            'optimized_activities': optimization_result,
            'critical_path': critical_path,
            'total_project_cost': total_project_cost,
            'ai_analysis': ai_analysis
        }

        return jsonify(response)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@bp.route('/api/v1.0/projectProgress', methods=['POST'])
def project_progress():
    try:
        data = request.json
        activities_data = data.get('activities', [])
        progress_data = data.get('progress', [])  # Lista de { "name": "A", "cost_actual": ..., "avance": ... }
        current_time = data.get('current_time', 0)  # Tiempo actual del proyecto

        # Crear instancias de Activity
        activities = [Activity(**act) for act in activities_data]

        # Calcular PERT
        pert_calculator = PERTCalculator(activities, expected_time=0)
        pert_calculator.calculate_pert()

        # Calcular costos actuales
        cost_analysis = []
        total_actual_cost = 0  # CRA - Costo Real Acumulado
        total_planned_cost = sum(activity.cost for activity in activities)

        for progress in progress_data:
            activity_name = progress["name"]
            cost_actual = progress["cost_spent"]
            avance = progress["progress"]  # Porcentaje de avance en tiempo (0-100%)

            # Calcular costo ganado y desvíos
            planned_cost = next((act.cost for act in activities if act.name == activity_name), 0)
            earned_value = (planned_cost * (avance / 100)) if planned_cost else 0
            cost_variance = earned_value - cost_actual
            cost_performance_index = (earned_value / cost_actual) if cost_actual > 0 else 0

            total_actual_cost += cost_actual

            cost_analysis.append({
                "activity": activity_name,
                "planned_cost": planned_cost,
                "actual_cost": cost_actual,
                "earned_value": earned_value,
                "cost_variance": cost_variance,
                "CPI": cost_performance_index
            })

        # Calcular índices generales del proyecto
        total_earned_value = sum(item["earned_value"] for item in cost_analysis)  # VDA
        total_cost_variance = total_earned_value - total_actual_cost
        overall_cpi = (total_earned_value / total_actual_cost) if total_actual_cost > 0 else 0  # IDC

        # Calcular costo presupuestado hasta current_time (CPAT)
        activity_times = pert_calculator.get_activity_times()
        budgeted_cost_at_time = sum(
            act.cost for act in activities if next((t for t in activity_times if t["name"] == act.name), {}).get("earliest_finish", float('inf')) <= current_time
        )

        project_cost_report = {
            "total_planned_cost": total_planned_cost,
            "total_actual_cost": total_actual_cost,  # CRA
            "total_earned_value": total_earned_value,  # VDA
            "total_cost_variance": total_cost_variance,
            "overall_CPI": overall_cpi,  # IDC
            "budgeted_cost_at_time": budgeted_cost_at_time,  # CPAT
            "activities": cost_analysis
        }

        # Generar datos de rendimiento acumulado de tiempos
        time_progression = []

        for activity in activity_times:
            if activity["earliest_finish"] <= current_time:
                time_progression.append({
                    "time": activity["earliest_finish"],
                    "cumulative_count": sum(1 for act in activity_times if act["earliest_finish"] <= activity["earliest_finish"])
                })

        response = {
            "cost_analysis": project_cost_report,
            "time_progression": time_progression
        }

        return jsonify(response)

    except Exception as e:
        return jsonify({'error': str(e)}), 500
