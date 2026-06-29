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
        Relationships: [];
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
        Relationships: [];
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
        Relationships: [];
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
          customer_name: string | null;
          customer_email: string | null;
          customer_phone: string | null;
          delivery_address: string | null;
          delivery_city: string | null;
          delivery_notes: string | null;
          order_type: "cart" | "coffret" | "packaging";
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
          customer_name?: string | null;
          customer_email?: string | null;
          customer_phone?: string | null;
          delivery_address?: string | null;
          delivery_city?: string | null;
          delivery_notes?: string | null;
          order_type?: "cart" | "coffret" | "packaging";
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
          customer_name?: string | null;
          customer_email?: string | null;
          customer_phone?: string | null;
          delivery_address?: string | null;
          delivery_city?: string | null;
          delivery_notes?: string | null;
          order_type?: "cart" | "coffret" | "packaging";
          created_at?: string;
        };
        Relationships: [];
      };
      order_items: {
        Row: {
          id: string;
          order_id: string;
          product_id: string | null;
          item_name: string | null;
          item_kind: "product" | "packaging";
          quantity: number;
          unit_price_cents: number;
        };
        Insert: {
          id?: string;
          order_id: string;
          product_id?: string | null;
          item_name?: string | null;
          item_kind?: "product" | "packaging";
          quantity?: number;
          unit_price_cents: number;
        };
        Update: {
          id?: string;
          order_id?: string;
          product_id?: string | null;
          item_name?: string | null;
          item_kind?: "product" | "packaging";
          quantity?: number;
          unit_price_cents?: number;
        };
        Relationships: [];
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
        Relationships: [];
      };
      categories: {
        Row: {
          id: string;
          slug: string;
          label: string;
          sort_order: number;
          is_active: boolean;
          show_on_menu: boolean;
          show_in_coffret: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          label: string;
          sort_order?: number;
          is_active?: boolean;
          show_on_menu?: boolean;
          show_in_coffret?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          slug?: string;
          label?: string;
          sort_order?: number;
          is_active?: boolean;
          show_on_menu?: boolean;
          show_in_coffret?: boolean;
          created_at?: string;
        };
        Relationships: [];
      };
      packagings: {
        Row: {
          id: string;
          slug: string;
          name: string;
          description: string | null;
          image_url: string | null;
          price_cents: number;
          auto_price: boolean;
          is_active: boolean;
          sort_order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          name: string;
          description?: string | null;
          image_url?: string | null;
          price_cents: number;
          auto_price?: boolean;
          is_active?: boolean;
          sort_order?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          slug?: string;
          name?: string;
          description?: string | null;
          image_url?: string | null;
          price_cents?: number;
          auto_price?: boolean;
          is_active?: boolean;
          sort_order?: number;
          created_at?: string;
        };
        Relationships: [];
      };
      packaging_items: {
        Row: {
          id: string;
          packaging_id: string;
          product_id: string;
          quantity: number;
        };
        Insert: {
          id?: string;
          packaging_id: string;
          product_id: string;
          quantity?: number;
        };
        Update: {
          id?: string;
          packaging_id?: string;
          product_id?: string;
          quantity?: number;
        };
        Relationships: [];
      };
      profiles: {
        Row: {
          id: string;
          full_name: string | null;
          phone: string | null;
          email: string | null;
          default_address: string | null;
          delivery_city: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          full_name?: string | null;
          phone?: string | null;
          email?: string | null;
          default_address?: string | null;
          delivery_city?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          full_name?: string | null;
          phone?: string | null;
          email?: string | null;
          default_address?: string | null;
          delivery_city?: string;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      site_settings: {
        Row: {
          id: number;
          site_name: string;
          tagline: string;
          description: string;
          logo_url: string | null;
          hero_image_url: string | null;
          city: string;
          country: string;
          locale: string;
          currency: string;
          craft_badge: string;
          contact_email: string | null;
          contact_phone: string | null;
          contact_address: string | null;
          whatsapp: string | null;
          instagram_url: string | null;
          facebook_url: string | null;
          updated_at: string;
        };
        Insert: {
          id?: number;
          site_name: string;
          tagline?: string;
          description?: string;
          logo_url?: string | null;
          hero_image_url?: string | null;
          city?: string;
          country?: string;
          locale?: string;
          currency?: string;
          craft_badge?: string;
          contact_email?: string | null;
          contact_phone?: string | null;
          contact_address?: string | null;
          whatsapp?: string | null;
          instagram_url?: string | null;
          facebook_url?: string | null;
          updated_at?: string;
        };
        Update: {
          id?: number;
          site_name?: string;
          tagline?: string;
          description?: string;
          logo_url?: string | null;
          hero_image_url?: string | null;
          city?: string;
          country?: string;
          locale?: string;
          currency?: string;
          craft_badge?: string;
          contact_email?: string | null;
          contact_phone?: string | null;
          contact_address?: string | null;
          whatsapp?: string | null;
          instagram_url?: string | null;
          facebook_url?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
}

export type Product = Database["public"]["Tables"]["products"]["Row"];
export type Category = Database["public"]["Tables"]["categories"]["Row"];
export type Packaging = Database["public"]["Tables"]["packagings"]["Row"];
export type PackagingItem = Database["public"]["Tables"]["packaging_items"]["Row"];
export type SiteSettingsRow = Database["public"]["Tables"]["site_settings"]["Row"];
export type BoxSize = Database["public"]["Tables"]["box_sizes"]["Row"];
export type BoxTheme = Database["public"]["Tables"]["box_themes"]["Row"];
export type Order = Database["public"]["Tables"]["orders"]["Row"];
export type OrderItem = Database["public"]["Tables"]["order_items"]["Row"];
export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
