
import { useEffect, useState } from "react";
import { fetchActivitiesByModule } from "../services/activityService";

function ModuleActivities({ moduleId }) {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!moduleId) return;

    let cancelled = false;

    async function loadActivities() {
      try {
        setLoading(true);
        setError("");

        const data = await fetchActivitiesByModule(moduleId);

        if (!cancelled) {
          setActivities(data);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message || "Unable to load activities.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadActivities();

    return () => {
      cancelled = true;
    };
  }, [moduleId]);

  if (loading) return <p>Loading activities...</p>;
  if (error) return <p>{error}</p>;
  if (activities.length === 0) return <p>No activities found for this module.</p>;

  return (
    <div>
      {activities.map((activity) => (
        <article key={activity.id}>
          <h3>{activity.title}</h3>
          <p>{activity.description}</p>
        </article>
      ))}
    </div>
  );
}

export default ModuleActivities;
