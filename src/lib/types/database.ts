export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      products: {
        Row: {
          id: string;
          slug: string;
          name: string;
          description: string | null;
          price_cents: number;
          image_url: string | null;
          category: string;
          is_chefs_pick: boolean;
          is_seasonal: boolean;
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          name: string;
          description?: string | null;
          price_cents: number;
          image_url?: string | null;
          category?: string;
          is_chefs_pick?: boolean;
          is_seasonal?: boolean;
          is_active?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          slug?: string;
          name?: string;
          description?: string | null;
          price_cents?: number;
          image_url?: string | null;
          category?: string;
          is_chefs_pick?: boolean;
          is_seasonal?: boolean;
          is_active?: boolean;
          created_at?: string;
        };
      };
      box_sizes: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          pieces: number;
          price_cents: number;
          sort_order: number;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string | null;
          pieces: number;
          price_cents: number;
          sort_order?: number;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string | null;
          pieces?: number;
          price_cents?: number;
          sort_order?: number;
        };
      };
      box_themes: {
        Row: {
          id: string;
          name: string;
          color_hex: string;
          sort_order: number;
        };
        Insert: {
          id?: string;
          name: string;
          color_hex: string;
          sort_order?: number;
        };
        Update: {
          id?: string;
          name?: string;
          color_hex?: string;
          sort_order?: number;
        };
      };
      orders: {
        Row: {
          id: string;
          user_id: string | null;
          stripe_session_id: string | null;
          status: "pending" | "paid" | "preparing" | "ready" | "cancelled";
          total_cents: number;
          custom_message: string | null;
          hide_price: boolean;
          box_size_id: string | null;
          box_theme_id: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          stripe_session_id?: string | null;
          status?: "pending" | "paid" | "preparing" | "ready" | "cancelled";
          total_cents: number;
          custom_message?: string | null;
          hide_price?: boolean;
          box_size_id?: string | null;
          box_theme_id?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string | null;
          stripe_session_id?: string | null;
          status?: "pending" | "paid" | "preparing" | "ready" | "cancelled";
          total_cents?: number;
          custom_message?: string | null;
          hide_price?: boolean;
          box_size_id?: string | null;
          box_theme_id?: string | null;
          created_at?: string;
        };
      };
      order_items: {
        Row: {
          id: string;
          order_id: string;
          product_id: string;
          quantity: number;
          unit_price_cents: number;
        };
        Insert: {
          id?: string;
          order_id: string;
          product_id: string;
          quantity?: number;
          unit_price_cents: number;
        };
        Update: {
          id?: string;
          order_id?: string;
          product_id?: string;
          quantity?: number;
          unit_price_cents?: number;
        };
      };
      favorites: {
        Row: {
          id: string;
          user_id: string;
          product_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          product_id: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          product_id?: string;
          created_at?: string;
        };
      };
    };
  };
}

export type Product = Database["public"]["Tables"]["products"]["Row"];
export type BoxSize = Database["public"]["Tables"]["box_sizes"]["Row"];
export type BoxTheme = Database["public"]["Tables"]["box_themes"]["Row"];
export type Order = Database["public"]["Tables"]["orders"]["Row"];
