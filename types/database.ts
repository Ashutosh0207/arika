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
      rooms: {
        Row: {
          id: string;
          name: string;
          slug: string | null;
          description: string | null;
          max_guests: number;
        };
        Insert: {
          id?: string;
          name: string;
          slug?: string | null;
          description?: string | null;
          max_guests?: number;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string | null;
          description?: string | null;
          max_guests?: number;
        };
        Relationships: [];
      };
      booking: {
        Row: {
          id: string;
          room_id: string;
          check_in: string;
          check_out: string;
          guest_count: number;
          guest_name: string;
          guest_email: string;
          guest_phone: string;
        };
        Insert: {
          id?: string;
          room_id: string;
          check_in: string;
          check_out: string;
          guest_count: number;
          guest_name: string;
          guest_email: string;
          guest_phone: string;
        };
        Update: {
          id?: string;
          room_id?: string;
          check_in?: string;
          check_out?: string;
          guest_count?: number;
          guest_name?: string;
          guest_email?: string;
          guest_phone?: string;
        };
        Relationships: [
          {
            foreignKeyName: "booking_room_id_fkey";
            columns: ["room_id"];
            isOneToOne: false;
            referencedRelation: "rooms";
            referencedColumns: ["id"];
          },
        ];
      };
      experiences: {
        Row: {
          id: string;
          name: string;
          description: string | null;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string | null;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string | null;
        };
        Relationships: [];
      };
      booking_experiences: {
        Row: {
          booking_id: string;
          experience_id: string;
        };
        Insert: {
          booking_id: string;
          experience_id: string;
        };
        Update: {
          booking_id?: string;
          experience_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "booking_experiences_booking_id_fkey";
            columns: ["booking_id"];
            isOneToOne: false;
            referencedRelation: "booking";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "booking_experiences_experience_id_fkey";
            columns: ["experience_id"];
            isOneToOne: false;
            referencedRelation: "experiences";
            referencedColumns: ["id"];
          },
        ];
      };
      admin_allowlist: {
        Row: {
          email: string;
          created_at: string;
        };
        Insert: {
          email: string;
          created_at?: string;
        };
        Update: {
          email?: string;
          created_at?: string;
        };
        Relationships: [];
      };
      room_images: {
        Row: {
          id: string;
          room_id: string;
          storage_path: string;
          public_url: string;
          sort_order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          room_id: string;
          storage_path: string;
          public_url: string;
          sort_order?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          room_id?: string;
          storage_path?: string;
          public_url?: string;
          sort_order?: number;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "room_images_room_id_fkey";
            columns: ["room_id"];
            isOneToOne: false;
            referencedRelation: "rooms";
            referencedColumns: ["id"];
          },
        ];
      };
      experience_images: {
        Row: {
          id: string;
          experience_id: string;
          storage_path: string;
          public_url: string;
          sort_order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          experience_id: string;
          storage_path: string;
          public_url: string;
          sort_order?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          experience_id?: string;
          storage_path?: string;
          public_url?: string;
          sort_order?: number;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "experience_images_experience_id_fkey";
            columns: ["experience_id"];
            isOneToOne: false;
            referencedRelation: "experiences";
            referencedColumns: ["id"];
          },
        ];
      };
      resort_gallery_images: {
        Row: {
          id: string;
          storage_path: string;
          public_url: string;
          sort_order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          storage_path: string;
          public_url: string;
          sort_order?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          storage_path?: string;
          public_url?: string;
          sort_order?: number;
          created_at?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      is_admin: {
        Args: Record<string, never>;
        Returns: boolean;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}

export type RoomRow = Database["public"]["Tables"]["rooms"]["Row"];
export type BookingRow = Database["public"]["Tables"]["booking"]["Row"];
export type ExperienceRow = Database["public"]["Tables"]["experiences"]["Row"];
export type AdminAllowlistRow =
  Database["public"]["Tables"]["admin_allowlist"]["Row"];
export type RoomImageRow = Database["public"]["Tables"]["room_images"]["Row"];
export type ExperienceImageRow =
  Database["public"]["Tables"]["experience_images"]["Row"];
export type ResortGalleryImageRow =
  Database["public"]["Tables"]["resort_gallery_images"]["Row"];
