ALTER TABLE "files" ADD COLUMN "id" serial PRIMARY KEY NOT NULL;--> statement-breakpoint
ALTER TABLE "files" ADD COLUMN "file_name" varchar NOT NULL;--> statement-breakpoint
ALTER TABLE "files" ADD COLUMN "file_key" varchar NOT NULL;--> statement-breakpoint
ALTER TABLE "files" ADD COLUMN "created_at" timestamp DEFAULT now();