"use client";
import { useEffect, useState } from "react";
import styles from "./page.module.css";

interface IAdress {
  cep: string;
  street: string;
  neighborhood: string;
  city: string;
  state: string;
}

export default function Home() {
  const [form, setForm] = useState<IAdress | undefined>({
    cep: "",
    street: "",
    neighborhood: "",
    city: "",
    state: "",
  });

  const [error, setError] = useState<string | undefined>();

  function cleanForm() {
    setForm({
      cep: "",
      street: "",
      neighborhood: "",
      city: "",
      state: "",
    });
  }

  function validateCep(cep: string) {
    cep = cep.replace(/\D/g, "");

    if (cep.length > 5) {
      setError("");
      cep = `${cep.slice(0, 5)}-${cep.slice(5)}`;
    }

    return cep;
  }

  async function searchAddress(cep: string) {
    if (cep.replace("-", "").length === 8) {
      await fetch(`https://viacep.com.br/ws/${cep.replace("-", "")}/json/`)
        .then((resp) => resp.json())
        .then((address) => {
          if (address.erro) return setError("CEP não encontrado");

          const formEdit = {
            ...form,
            street: address.logradouro,
            neighborhood: address.bairro,
            city: address.localidade,
            state: address.uf,
          };

          setForm(formEdit as IAdress);
        })
        .catch((e) => console.log(e));
    }
  }

  function submitForm(event: React.FormEvent) {
    event.preventDefault();
    saveForm();
  }

  function saveForm() {
    if (form) {
      const json = JSON.stringify(form, null, 2);
      const blob = new Blob([json], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "form-data.json";
      a.click();
      URL.revokeObjectURL(url);
    }
  }

  useEffect(() => {
    if (form?.cep.replace("-", "").length === 8) {
      searchAddress(form.cep);
    }
  }, [form?.cep]);

  return (
    <main className={styles.main}>
      <h1>Buscar endereço</h1>
      <form className={styles.form} onSubmit={submitForm}>
        <label htmlFor="cep">CEP</label>
        <input
          className={styles.input}
          maxLength={9}
          type="text"
          id="cep"
          placeholder="Digite o CEP"
          value={form?.cep}
          onChange={(e) => {
            const formEdit = {
              ...form,
              cep: validateCep(e.target.value),
            };
            setForm(formEdit as IAdress);
          }}
        />
        {error && <span className={styles.error}>{error}</span>}

        <label htmlFor="street">Rua</label>
        <input
          id="street"
          className={styles.input}
          value={form?.street}
          type="text"
          placeholder="Rua"
        />

        <label htmlFor="neighborhood">Bairro</label>
        <input
          id="neighborhood"
          className={styles.input}
          value={form?.neighborhood}
          type="text"
          placeholder="Bairro"
        />

        <label htmlFor="city">Cidade</label>
        <input
          id="city"
          className={styles.input}
          value={form?.city}
          type="text"
          placeholder="Cidade"
        />

        <label htmlFor="state">Estado</label>
        <input
          id="state"
          className={styles.input}
          type="text"
          value={form?.state}
          placeholder="Estado"
        />

        <div className={styles.divButtons}>
          <button
            className={styles.buttonCancel}
            type="button"
            onClick={cleanForm}
          >
            Limpar formulario
          </button>
          <button className={styles.buttonSuccess} type="submit">
            Salvar Endereço
          </button>
        </div>
      </form>
    </main>
  );
}
