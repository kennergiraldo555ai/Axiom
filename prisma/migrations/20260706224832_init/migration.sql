-- CreateEnum
CREATE TYPE "Plan" AS ENUM ('FREE', 'PRO', 'TEAM', 'ENTERPRISE');

-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('OWNER', 'ADMIN', 'MEMBER');

-- CreateEnum
CREATE TYPE "IntegrationStatus" AS ENUM ('DISCONNECTED', 'CONNECTED', 'ERROR');

-- CreateEnum
CREATE TYPE "AnalysisStatus" AS ENUM ('PENDING', 'IN_PROGRESS', 'COMPLETED', 'FAILED', 'SKIPPED');

-- CreateEnum
CREATE TYPE "LeadSource" AS ENUM ('PROSPECTING', 'MANUAL', 'IMPORTED', 'REFERRAL');

-- CreateEnum
CREATE TYPE "LeadStatus" AS ENUM ('NEW', 'CONTACTED', 'QUALIFIED', 'PROPOSAL', 'WON', 'LOST', 'ARCHIVED');

-- CreateTable
CREATE TABLE "workspaces" (
    "id" VARCHAR(26) NOT NULL DEFAULT gen_random_ulid(),
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "plan" "Plan" NOT NULL DEFAULT 'FREE',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "workspaces_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "memberships" (
    "id" VARCHAR(26) NOT NULL DEFAULT gen_random_ulid(),
    "workspace_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'MEMBER',
    "joined_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "memberships_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" VARCHAR(26) NOT NULL DEFAULT gen_random_ulid(),
    "auth_id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "avatar_url" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "api_keys" (
    "id" VARCHAR(26) NOT NULL DEFAULT gen_random_ulid(),
    "workspace_id" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "encrypted_key" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "api_keys_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "integrations" (
    "id" VARCHAR(26) NOT NULL DEFAULT gen_random_ulid(),
    "workspace_id" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "status" "IntegrationStatus" NOT NULL DEFAULT 'DISCONNECTED',
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "integrations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ai_cost_records" (
    "id" VARCHAR(26) NOT NULL DEFAULT gen_random_ulid(),
    "workspace_id" TEXT NOT NULL,
    "task_id" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "input_tokens" INTEGER NOT NULL,
    "output_tokens" INTEGER NOT NULL,
    "cost_usd_cents" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ai_cost_records_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ai_prompt_logs" (
    "id" VARCHAR(26) NOT NULL DEFAULT gen_random_ulid(),
    "workspace_id" TEXT NOT NULL,
    "task_id" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "input_hash" TEXT NOT NULL,
    "input_json" JSONB NOT NULL,
    "output_json" JSONB NOT NULL,
    "duration_ms" INTEGER NOT NULL,
    "tokens_in" INTEGER NOT NULL,
    "tokens_out" INTEGER NOT NULL,
    "error_message" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ai_prompt_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "business_categories" (
    "id" VARCHAR(26) NOT NULL DEFAULT gen_random_ulid(),
    "workspace_id" TEXT,
    "label" TEXT NOT NULL,
    "google_place_type" TEXT NOT NULL,
    "icon" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "business_categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cities" (
    "id" VARCHAR(26) NOT NULL DEFAULT gen_random_ulid(),
    "name" TEXT NOT NULL,
    "country_code" TEXT NOT NULL,
    "lat" DOUBLE PRECISION NOT NULL,
    "lng" DOUBLE PRECISION NOT NULL,
    "place_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "cities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "prospects" (
    "id" VARCHAR(26) NOT NULL DEFAULT gen_random_ulid(),
    "workspace_id" TEXT NOT NULL,
    "place_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category_id" TEXT,
    "city_id" TEXT,
    "address" TEXT,
    "phone" TEXT,
    "website" TEXT,
    "email" TEXT,
    "rating" DOUBLE PRECISION,
    "user_ratings_count" INTEGER,
    "price_level" INTEGER,
    "business_status" TEXT,
    "google_url" TEXT,
    "lat" DOUBLE PRECISION,
    "lng" DOUBLE PRECISION,
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "analysis_status" "AnalysisStatus" NOT NULL DEFAULT 'PENDING',
    "quality_score" INTEGER,
    "score_rationale" JSONB,
    "signals" JSONB,
    "opportunities" JSONB,
    "analyzed_at" TIMESTAMP(3),
    "analyzed_by_model" TEXT,
    "message_draft" TEXT,
    "message_draft_model" TEXT,
    "message_draft_at" TIMESTAMP(3),
    "message_edited" TEXT,
    "user_notes" TEXT,
    "converted_to_lead_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "prospects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "leads" (
    "id" VARCHAR(26) NOT NULL DEFAULT gen_random_ulid(),
    "workspace_id" TEXT NOT NULL,
    "prospect_id" TEXT,
    "name" TEXT NOT NULL,
    "business_name" TEXT,
    "email" TEXT,
    "phone" TEXT,
    "website" TEXT,
    "source" "LeadSource" NOT NULL DEFAULT 'PROSPECTING',
    "status" "LeadStatus" NOT NULL DEFAULT 'NEW',
    "quality_score" INTEGER,
    "final_message" TEXT,
    "priority" INTEGER NOT NULL DEFAULT 0,
    "value_cents" INTEGER,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "expected_close_at" TIMESTAMP(3),
    "assigned_to_id" TEXT,
    "last_contacted_at" TIMESTAMP(3),
    "next_follow_up_at" TIMESTAMP(3),
    "outreach_channel" TEXT,
    "outreach_sent_at" TIMESTAMP(3),
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "leads_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lead_activities" (
    "id" VARCHAR(26) NOT NULL DEFAULT gen_random_ulid(),
    "lead_id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "lead_activities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lead_events" (
    "id" VARCHAR(26) NOT NULL DEFAULT gen_random_ulid(),
    "lead_id" TEXT NOT NULL,
    "event_type" TEXT NOT NULL,
    "from_value" TEXT,
    "to_value" TEXT,
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "lead_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tasks" (
    "id" VARCHAR(26) NOT NULL DEFAULT gen_random_ulid(),
    "workspace_id" TEXT NOT NULL,
    "lead_id" TEXT,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "due_date" TIMESTAMP(3),
    "is_completed" BOOLEAN NOT NULL DEFAULT false,
    "assigned_to_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tasks_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "workspaces_slug_key" ON "workspaces"("slug");

-- CreateIndex
CREATE INDEX "memberships_user_id_idx" ON "memberships"("user_id");

-- CreateIndex
CREATE INDEX "memberships_workspace_id_idx" ON "memberships"("workspace_id");

-- CreateIndex
CREATE UNIQUE INDEX "memberships_workspace_id_user_id_key" ON "memberships"("workspace_id", "user_id");

-- CreateIndex
CREATE UNIQUE INDEX "users_auth_id_key" ON "users"("auth_id");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_auth_id_idx" ON "users"("auth_id");

-- CreateIndex
CREATE INDEX "api_keys_workspace_id_idx" ON "api_keys"("workspace_id");

-- CreateIndex
CREATE UNIQUE INDEX "api_keys_workspace_id_provider_key" ON "api_keys"("workspace_id", "provider");

-- CreateIndex
CREATE INDEX "integrations_workspace_id_idx" ON "integrations"("workspace_id");

-- CreateIndex
CREATE INDEX "ai_cost_records_workspace_id_created_at_idx" ON "ai_cost_records"("workspace_id", "created_at");

-- CreateIndex
CREATE INDEX "ai_cost_records_task_id_idx" ON "ai_cost_records"("task_id");

-- CreateIndex
CREATE INDEX "ai_prompt_logs_workspace_id_created_at_idx" ON "ai_prompt_logs"("workspace_id", "created_at");

-- CreateIndex
CREATE INDEX "ai_prompt_logs_task_id_idx" ON "ai_prompt_logs"("task_id");

-- CreateIndex
CREATE INDEX "ai_prompt_logs_input_hash_idx" ON "ai_prompt_logs"("input_hash");

-- CreateIndex
CREATE UNIQUE INDEX "business_categories_workspace_id_label_key" ON "business_categories"("workspace_id", "label");

-- CreateIndex
CREATE UNIQUE INDEX "cities_name_country_code_key" ON "cities"("name", "country_code");

-- CreateIndex
CREATE UNIQUE INDEX "prospects_converted_to_lead_id_key" ON "prospects"("converted_to_lead_id");

-- CreateIndex
CREATE INDEX "prospects_workspace_id_city_id_category_id_idx" ON "prospects"("workspace_id", "city_id", "category_id");

-- CreateIndex
CREATE INDEX "prospects_workspace_id_quality_score_idx" ON "prospects"("workspace_id", "quality_score");

-- CreateIndex
CREATE INDEX "prospects_workspace_id_analysis_status_idx" ON "prospects"("workspace_id", "analysis_status");

-- CreateIndex
CREATE INDEX "prospects_workspace_id_converted_to_lead_id_idx" ON "prospects"("workspace_id", "converted_to_lead_id");

-- CreateIndex
CREATE UNIQUE INDEX "prospects_workspace_id_place_id_key" ON "prospects"("workspace_id", "place_id");

-- CreateIndex
CREATE INDEX "leads_workspace_id_status_idx" ON "leads"("workspace_id", "status");

-- CreateIndex
CREATE INDEX "leads_workspace_id_priority_idx" ON "leads"("workspace_id", "priority");

-- CreateIndex
CREATE INDEX "leads_workspace_id_next_follow_up_at_idx" ON "leads"("workspace_id", "next_follow_up_at");

-- CreateIndex
CREATE INDEX "lead_activities_lead_id_created_at_idx" ON "lead_activities"("lead_id", "created_at");

-- CreateIndex
CREATE INDEX "lead_events_lead_id_created_at_idx" ON "lead_events"("lead_id", "created_at");

-- CreateIndex
CREATE INDEX "lead_events_event_type_created_at_idx" ON "lead_events"("event_type", "created_at");

-- CreateIndex
CREATE INDEX "tasks_workspace_id_is_completed_due_date_idx" ON "tasks"("workspace_id", "is_completed", "due_date");

-- CreateIndex
CREATE INDEX "tasks_lead_id_idx" ON "tasks"("lead_id");

-- AddForeignKey
ALTER TABLE "memberships" ADD CONSTRAINT "memberships_workspace_id_fkey" FOREIGN KEY ("workspace_id") REFERENCES "workspaces"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "memberships" ADD CONSTRAINT "memberships_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "api_keys" ADD CONSTRAINT "api_keys_workspace_id_fkey" FOREIGN KEY ("workspace_id") REFERENCES "workspaces"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "integrations" ADD CONSTRAINT "integrations_workspace_id_fkey" FOREIGN KEY ("workspace_id") REFERENCES "workspaces"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ai_cost_records" ADD CONSTRAINT "ai_cost_records_workspace_id_fkey" FOREIGN KEY ("workspace_id") REFERENCES "workspaces"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "business_categories" ADD CONSTRAINT "business_categories_workspace_id_fkey" FOREIGN KEY ("workspace_id") REFERENCES "workspaces"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "prospects" ADD CONSTRAINT "prospects_workspace_id_fkey" FOREIGN KEY ("workspace_id") REFERENCES "workspaces"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "prospects" ADD CONSTRAINT "prospects_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "business_categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "prospects" ADD CONSTRAINT "prospects_city_id_fkey" FOREIGN KEY ("city_id") REFERENCES "cities"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "prospects" ADD CONSTRAINT "prospects_converted_to_lead_id_fkey" FOREIGN KEY ("converted_to_lead_id") REFERENCES "leads"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "leads" ADD CONSTRAINT "leads_workspace_id_fkey" FOREIGN KEY ("workspace_id") REFERENCES "workspaces"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "leads" ADD CONSTRAINT "leads_prospect_id_fkey" FOREIGN KEY ("prospect_id") REFERENCES "prospects"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lead_activities" ADD CONSTRAINT "lead_activities_lead_id_fkey" FOREIGN KEY ("lead_id") REFERENCES "leads"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lead_events" ADD CONSTRAINT "lead_events_lead_id_fkey" FOREIGN KEY ("lead_id") REFERENCES "leads"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_workspace_id_fkey" FOREIGN KEY ("workspace_id") REFERENCES "workspaces"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_lead_id_fkey" FOREIGN KEY ("lead_id") REFERENCES "leads"("id") ON DELETE SET NULL ON UPDATE CASCADE;
