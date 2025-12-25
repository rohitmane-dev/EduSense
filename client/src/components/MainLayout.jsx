import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

const MainLayout = () => {
    return (
        <div className="min-h-screen bg-light-bg dark:bg-dark-bg theme-transition">
            <Navbar />
            <div className="flex">
                <Sidebar />
                <main className="flex-1 min-h-[calc(100vh-4rem)] w-full overflow-x-hidden">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default MainLayout;
