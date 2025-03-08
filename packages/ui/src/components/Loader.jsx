import { Loader2 } from "lucide-react";

const Loader = () => {
  return (
    <div className="flex justify-center items-center min-h-screen">
      <Loader2 className="h-12 w-12 animate-spin text-indigo-500" />
    </div>
  );
};

export default Loader;
