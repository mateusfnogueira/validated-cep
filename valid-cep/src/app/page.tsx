"use client";
import styles from "./page.module.css";
import { useCallback, useEffect, useState } from "react";

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

  function cleanForm() {
    setForm(undefined);
  }

  function validateCep(cep: string) {
    if (cep.length >= 5) {
      cep = `${cep.slice(0, 5)}-${cep.slice(5, 8)}`;
    }

    console.log(cep);

    return cep;
  }

  const searchAddress = useCallback(async () => {
    await fetch(`https://viacep.com.br/ws/${form?.cep}/json/`)
      .then((resp) => resp.json())
      .then((address) => {
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
  }, [form]);

  function submitForm(event: React.FormEvent) {
    console.log(event);
  }

  useEffect(() => {
    if (form?.cep.length === 9) {
      searchAddress();
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
              cep: validateCep(e.target.value.replace(/\D/g, "")),
            };
            setForm(formEdit as IAdress);
          }}
        />

        <label htmlFor="stret">Rua</label>
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
