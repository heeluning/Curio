CREATE TABLE "files" (
	"id" serial PRIMARY KEY NOT NULL,
	"file_name" varchar NOT NULL,
	"file_key" varchar NOT NULL,
	"notes" text,
	"created_at" timestamp DEFAULT now()
);
