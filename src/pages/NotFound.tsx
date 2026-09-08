import { motion } from "framer-motion";
import { Droplets, Home } from "lucide-react";
import { Link } from "react-router";
import { useI18n } from "@/lib/i18n";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  const { t } = useI18n();
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="flex min-h-[70vh] flex-col items-center justify-center px-4 py-20 text-center"
    >
      <div className="relative">
        <p className="text-[7rem] font-extrabold leading-none tracking-tighter text-primary/10 sm:text-[10rem]">
          404
        </p>
        <motion.span
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-0 m-auto flex size-16 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg"
        >
          <Droplets className="size-8" />
        </motion.span>
      </div>
      <h1 className="mt-4 text-2xl font-extrabold tracking-tight">{t("misc.notFound")}</h1>
      <p className="mt-2 max-w-sm text-sm leading-6 text-muted-foreground">{t("misc.notFoundDesc")}</p>
      <Button asChild className="mt-6 gap-2">
        <Link to="/">
          <Home className="size-4" />
          {t("misc.goHome")}
        </Link>
      </Button>
    </motion.div>
  );
}
