import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircleIcon } from "lucide-react";

const ThanksPage = () => {
  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown((prev) => (prev > 1 ? prev - 1 : 1));
    }, 1000);

    setTimeout(() => {
      if (window.opener) {
        close();
      }
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-6">
          <div className="p-3 bg-green-100 rounded-full">
            <CheckCircleIcon className="w-12 h-12 text-green-600" />
          </div>
        </div>

        <Card className="border-green-200 shadow-lg">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl text-center font-bold text-gray-800">
              Спасибо за ваш отклик!
            </CardTitle>
          </CardHeader>

          <CardContent>
            <p className="text-gray-600 text-sm text-center mb-4">
              Мы получили вашу информацию и скоро свяжемся с вами при
              необходимости. Если у вас есть дополнительные вопросы, пожалуйста,
              свяжитесь с нами.
            </p>
            <p className="text-gray-500 text-sm text-center mt-4">
              Окно закроется через {countdown} секунд...
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ThanksPage;
