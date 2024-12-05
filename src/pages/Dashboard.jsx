import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

axios.defaults.withCredentials = true;

// Internationalization dictionary
const translations = {
  en: {
    welcome: 'Welcome to Your Dashboard',
    income: {
      title: 'Income',
      description: 'View and manage your income sources.',
      goTo: 'Go to Income',
    },
    expenses: {
      title: 'Expenses',
      description: 'Track and categorize your expenses.',
      goTo: 'Go to Expenses',
    },
    categories: {
      title: 'Categories',
      description: 'Organize your expenses by categories.',
      goTo: 'Go to Categories',
    },
    expenseOverview: 'Expense Overview',
    noData: 'No data available',
    logout: 'Logout',
  },
  fr: {
    welcome: 'Bienvenue sur votre tableau de bord',
    income: {
      title: 'Revenus',
      description: 'Visualiser et gérer vos sources de revenus.',
      goTo: 'Aller aux Revenus',
    },
    expenses: {
      title: 'Dépenses',
      description: 'Suivre et catégoriser vos dépenses.',
      goTo: 'Aller aux Dépenses',
    },
    categories: {
      title: 'Catégories',
      description: 'Organiser vos dépenses par catégories.',
      goTo: 'Aller aux Catégories',
    },
    expenseOverview: 'Aperçu des Dépenses',
    noData: 'Aucune donnée disponible',
    logout: 'Déconnexion',
  },
  rw: {
    welcome: 'Muraho Dashboard yawe',
    income: {
      title: 'Idozi',
      description: 'Reba no gucunga inkomoko z\'idozi.',
      goTo: 'Kujya ku Idozi',
    },
    expenses: {
      title: 'Amafaranga yatanzwe',
      description: 'Kugenzura no gukurikirana amafaranga yatanzwe.',
      goTo: 'Kujya ku Amafaranga yatanzwe',
    },
    categories: {
      title: 'Ingingi',
      description: 'Gushyira amafaranga yatanzwe mu nzira.',
      goTo: 'Kujya ku Ingingi',
    },
    expenseOverview: 'Kureba Amafaranga yatanzwe',
    noData: 'Nta makuru ahari',
    logout: 'Gusohoka',
  },
  es: {
    welcome: 'Bienvenido a tu Panel',
    income: {
      title: 'Ingresos',
      description: 'Ver y administrar tus fuentes de ingresos.',
      goTo: 'Ir a Ingresos',
    },
    expenses: {
      title: 'Gastos',
      description: 'Seguimiento y categorización de gastos.',
      goTo: 'Ir a Gastos',
    },
    categories: {
      title: 'Categorías',
      description: 'Organizar gastos por categorías.',
      goTo: 'Ir a Categorías',
    },
    expenseOverview: 'Resumen de Gastos',
    noData: 'No hay datos disponibles',
    logout: 'Cerrar sesión',
  },
};

ChartJS.register(ArcElement, Tooltip, Legend);

const API_URL = import.meta.env.VITE_API_URL || 'https://personalexpensetrackerbackend-3htl.onrender.com';

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [username, setUsername] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch dashboard data
        const dashboardResponse = await axios.get(`${API_URL}/dashboard`, {
          withCredentials: true,
        });
        setDashboardData(dashboardResponse.data);

        // Fetch username
        const userResponse = await axios.get(`${API_URL}/dashboard/profile`, {
          withCredentials: true,
        });
        setUsername(userResponse.data.username);

        setLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err.response || err);
        setError('Failed to fetch dashboard data.');
        setLoading(false);

        // Redirect to login if unauthorized
        if (err.response && err.response.status === 401) {
          navigate('/login');
        }
      }
    };

    fetchDashboardData();
  }, [navigate]);

  // Logout handler
  const handleLogout = async () => {
    try {
      await axios.post(`${API_URL}/logout`, {}, { withCredentials: true });
      navigate('/login');
    } catch (err) {
      console.error('Logout failed', err);
    }
  };

  const languageOptions = [
    { country: 'us', lang: 'en', label: 'English' },
    { country: 'fr', lang: 'fr', label: 'French' },
    { country: 'rw', lang: 'rw', label: 'Kinyarwanda' },
    { country: 'es', lang: 'es', label: 'Spanish' },
  ];

  const t = translations[currentLanguage];

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  // const pieData = {
  //   labels: [t.income.title, t.expenses.title, t.categories.title],
  //   datasets: [
  //     {
  //       data: [
  //         dashboardData?.income || 300,
  //         dashboardData?.expenses || 50,
  //         dashboardData?.categories || 100,
  //       ],
  //       backgroundColor: ['#4CAF50', '#FF9800', '#2196F3'],
  //       hoverBackgroundColor: ['#45a049', '#ff8c00', '#1976d2'],
  //       borderWidth: 1,
  //     },
  //   ],
  // };

  const pieData = {
    labels: ['Income', 'Expenses', 'Categories'],
    datasets: [
      {
        data: [200, 150, 100],  // Default data
        backgroundColor: ['#4CAF50', '#FF9800', '#2196F3'],
        hoverBackgroundColor: ['#45a049', '#ff8c00', '#1976d2'],
        borderWidth: 1,
      },
    ],
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              {username ? `${username}` : t.welcome}
            </h2>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex space-x-2">
              {languageOptions.map(({ country, lang, label }) => (
                <button 
                  key={lang} 
                  onClick={() => setCurrentLanguage(lang)}
                  className={`transition-transform hover:scale-110 ${currentLanguage === lang ? 'border-2 border-blue-500 rounded' : ''}`}
                >
                  <img
                    src={`https://flagcdn.com/w40/${country}.png`}
                    alt={label}
                    className="h-5 w-8"
                  />
                </button>
              ))}
            </div>
            </div>
          
          <div className="flex items-center space-x-4">
            <button
              onClick={handleLogout}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              {t.logout}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">{t.welcome}</h1>

        <div className="grid grid-cols-1 gap-6 mb-8 md:grid-cols-3">
          {[t.income, t.expenses, t.categories].map(({ title, description, goTo }, idx) => (
            <div
              key={idx}
              className="bg-white overflow-hidden shadow rounded-lg"
            >
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg font-medium text-gray-900">{title}</h3>
                <p className="mt-1 text-sm text-gray-500">{description}</p>
                <Link
                  to={`/user/${title.toLowerCase()}`}
                  className="mt-4 block w-full px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 text-center"
                >
                  {goTo}
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              {t.expenseOverview}
            </h3>
            <div className="h-64 bg-gray-100 rounded flex items-center justify-center">
              {/* {dashboardData ? (
                <Pie data={pieData} />
              ) : (
                <p className="text-gray-500">{t.noData}</p>
              )} */}
               <Pie data={pieData} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
