import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import LandingPage from './pages/Landing';
import Login from './pages/Login'; // Changed from import { Login }
import SignUp from './pages/SignUp';
import IncomeList from './pages/IncomeList';
import IncomeForm from './pages/IncomeForm';
import ExpenseCategories from './pages/ExpenseCategories';
import ExpenseCategoryForm from './pages/ExpenseCategoryForm';
import UpdateIncomeForm from './pages/UpdateIncomeForm';
import ExpensesList from './pages/ExpensesList';
import CreateExpenseForm from './pages/CreateExpenseForm';
import UpdateExpenseForm from './pages/UpdateExpenseForm';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPaasswordPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/user/expenses/edit/:id" element={<UpdateExpenseForm />} />
        <Route path="/user/income" element={<IncomeList />} />
        <Route path="/user/incomeForm" element={<IncomeForm />} />
        <Route path="/user/updateIncome/:id" element={<UpdateIncomeForm/>}/>
        <Route path="/user/category" element={<ExpenseCategoryForm />} />
        <Route path="/user/categories" element={<ExpenseCategories />} />
        <Route path="/user/expenses" element={<ExpensesList/>} />
        <Route path="/user/expensesForm/" element={<CreateExpenseForm />} />
        <Route path="/user/forgotpasswordReq/" element={<ForgotPasswordPage/>} />
        <Route path="/user/resetpassword/" element={<ResetPasswordPage/>} />



      </Routes>
    </BrowserRouter>
  );
}