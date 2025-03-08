import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import FormFieldManager from "./components/FormFieldManager";
import SubmissionsList from "./components/SubmissionsList";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import Loader from "@/components/Loader";

const Dashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("fields");
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      navigate("/admin/login");
    } else {
      setIsAuthenticated(true);
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    navigate("/admin/login");
  };

  if (!isAuthenticated) {
    <Loader />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Административная панель</h1>
        <Button variant="destructive" onClick={handleLogout}>
          Выйти
        </Button>
      </div>

      <Card className="p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="fields">Поля формы</TabsTrigger>
            <TabsTrigger value="submissions">Отправленные данные</TabsTrigger>
          </TabsList>

          <TabsContent value="fields">
            <FormFieldManager />
          </TabsContent>
          <TabsContent value="submissions">
            <SubmissionsList />
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
};

export default Dashboard;
