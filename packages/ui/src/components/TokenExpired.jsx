import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { LockIcon, AlertTriangleIcon } from "lucide-react";

const TokenExpiredPage = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-6">
          <div className="p-3 bg-amber-100 rounded-full">
            <LockIcon className="w-12 h-12 text-amber-600" />
          </div>
        </div>

        <Card className="border-amber-200 shadow-lg">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl text-center font-bold text-gray-800">
              Сессия истекла
            </CardTitle>
          </CardHeader>

          <CardContent>
            <Alert
              variant="warning"
              className="mb-4 bg-amber-50 border-amber-200"
            >
              <AlertTriangleIcon className="h-5 w-5 text-amber-600" />
              <AlertTitle className="text-amber-800">
                Токен авторизации истек
              </AlertTitle>
              <AlertDescription className="text-amber-700">
                Ваша сессия была завершена из-за длительного периода
                неактивности. Пожалуйста, войдите снова, чтобы продолжить
                работу.
              </AlertDescription>
            </Alert>

            <p className="text-gray-600 text-sm mb-4">
              В целях безопасности мы автоматически завершаем сессии после
              определенного периода неактивности. Все несохраненные данные могли
              быть потеряны.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TokenExpiredPage;
