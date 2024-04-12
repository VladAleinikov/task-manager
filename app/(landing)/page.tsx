import { Button } from "@/components/ui/button";
import { Medal } from "lucide-react";
import Link from "next/link";

const LandingPage = () => {
  return (
    <div className="flex items-center justify-center flex-col">
      <div className="flex items-center justify-center flex-col">
        <h1 className="text-3xl md:text-6xl text-center text-neutral-800 mb-6">
          Начни свою работу с
        </h1>
        <div className="font-bold text-3xl md:text-6xl bg-gradient-to-r from-fuchsia-600 to-pink-600 text-white px-4 p-2 rounded-md pb-4">
          распределения задач
        </div>
      </div>
      <div className="text-sm md:text-xl text-neutral-400 mt-4 max-w-xs md:max-w-2xl text-center mx-auto">
        Сотрудничайте, управляйте проектами и достигайте новых пиков
        производительности.
      </div>
      <Button className="mt-6" size="lg" asChild>
        <Link href={"/sign-up"}>Начнём!!!</Link>
      </Button>
    </div>
  );
};

export default LandingPage;
