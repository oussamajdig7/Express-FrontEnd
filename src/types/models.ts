export type Id = number

export type WithTimestamps = {
  createdAt?: string
}

export type Categorie = WithTimestamps & {
  id: Id
  name: string
  coleur: string
}

export type Produit = WithTimestamps & {
  id: Id
  name: string
  description: string
  price: number
  IdCategorie: Id
  categorie?: Categorie
}

export type Vendeur = WithTimestamps & {
  id: Id
  name: string
  email: string
  password?: string
}

export type Client = WithTimestamps & {
  id: Id
  name: string
  prenom: string
  idVendeur: Id
  vendeur?: Vendeur
}

export type Vente = WithTimestamps & {
  id: Id
  idProduit: Id
  idClient: Id
  Qte: number
  CordonnéGPS: string
  produit?: Produit
  client?: Client
}

export type Stats = {
  clients: number
  produits: number
  ventes: number
  categories: number
}

