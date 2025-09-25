import { useEffect, useState } from "react";
import { format, subDays } from "date-fns";

function useUsdBrlRate() {
  const [rate, setRate] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRate = async () => {
      try {
        // yesterday’s date formatted as MM-DD-YYYY
        const yesterday = subDays(new Date(), 1);
        const dateParam = format(yesterday, "MM-dd-yyyy");

        const url = `https://olinda.bcb.gov.br/olinda/servico/PTAX/versao/v1/odata/CotacaoDolarDia(dataCotacao=@dataCotacao)?@dataCotacao='${dateParam}'&$top=100&$format=json`;

        const res = await fetch(url);
        const data = await res.json();

        if (data?.value?.length > 0) {
          setRate(data.value[0].cotacaoCompra);
        }
      } catch (err) {
        console.error("Failed to fetch USD/BRL rate", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRate();
  }, []);

  return { rate, loading };
}

export default useUsdBrlRate;
