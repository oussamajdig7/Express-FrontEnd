import type { Stats } from '../types/models'
import type { Categorie, Client, Produit, Vente } from '../types/models'
import { listResource } from './resources'

export async function getStats(): Promise<Stats> {
  const [clients, produits, ventes, categories] = await Promise.all([
    listResource<Client>('/clients'),
    listResource<Produit>('/produits'),
    listResource<Vente>('/ventes'),
    listResource<Categorie>('/categories'),
  ])
  console.log('Clients:', clients);
  console.log('Produits:', produits);
  console.log('Ventes:', ventes);
  console.log('Categories:', categories);

  return {
    clients: clients.length,
    produits: produits.length,
    ventes: ventes.length,
    categories: categories.length,
  }
}
