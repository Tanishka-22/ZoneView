import Project from '../models/projects.js';

export const getAnalyticsSummary = async (req, res) => {
  try {
    const all = await Project.find();
    const totalProjects = all.length;
    const totalValue = all.reduce((sum, p) => sum + (p.cost || 0), 0);
    const delayed = all.filter(p => p.status?.toLowerCase() === 'delayed').length;
    const avgProgress =
      totalProjects > 0
        ? Math.round(all.reduce((sum, p) => sum + (p.progress || 0), 0) / totalProjects)
        : 0;
    const zoneCounts = {};
    const statusCounts = {};
    const monthlyCounts = {};

    all.forEach((p) => {
      if (p.zone) {
        zoneCounts[p.zone] = (zoneCounts[p.zone] || 0) + 1;
      }
      if (p.status) {
        statusCounts[p.status] = (statusCounts[p.status] || 0) + 1;
      }
      if (p.lastUpdated) {
        const month = new Date(p.lastUpdated).toLocaleString('default', { month: 'short', year: 'numeric' });
        monthlyCounts[month] = (monthlyCounts[month] || 0) + 1;
      }
    });

    const topProjects = [...all]
      .sort((a, b) => (b.cost || 0) - (a.cost || 0))
      .slice(0, 5);

    res.json({
      totalProjects,
      totalValue,
      delayed,
      avgProgress,
      zoneCounts,
      statusCounts,
      monthlyCounts,
      topProjects,
    });
  } catch (err) {
    res.status(500).json({ message: 'Analytics error', error: err.message });
  }
};

