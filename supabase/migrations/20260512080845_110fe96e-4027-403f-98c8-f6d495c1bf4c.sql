
-- 1) Make existing user admin
INSERT INTO public.user_roles (user_id, role)
VALUES ('7b25e562-aeac-4f72-8331-f062b52eaae8', 'admin')
ON CONFLICT (user_id, role) DO NOTHING;

-- 2) Federations
CREATE TABLE IF NOT EXISTS public.federations (
  id text PRIMARY KEY,
  name text NOT NULL,
  motto text,
  description text,
  color_hex text,
  icon text,
  domain text,
  active boolean NOT NULL DEFAULT true,
  modules jsonb NOT NULL DEFAULT '[]'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.federations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone reads federations" ON public.federations FOR SELECT USING (true);
CREATE POLICY "Admins write federations" ON public.federations FOR ALL TO authenticated
  USING (has_role(auth.uid(),'admin')) WITH CHECK (has_role(auth.uid(),'admin'));

INSERT INTO public.federations (id,name,motto,description,color_hex,icon,domain,modules) VALUES
('educativa','Federación Educativa','Saber sin fronteras','Universidad TAMV, escuelas y academias','#3B82F6','graduation-cap','utamv.tamv.online','["utamv","masterclass","biblioteca"]'),
('cultural','Federación Cultural','Memoria viva del territorio','Manuscrito, museos, rituales y patrimonio','#A855F7','book','cultura.tamv.online','["manuscrito","museos","rituales"]'),
('economica','Federación Económica','Comercio soberano','Mercado, comercios, MSR y BookPI','#F59E0B','coins','mercado.tamv.online','["mercado","msr","bookpi","stripe"]'),
('tecnologica','Federación Tecnológica','Infraestructura cognitiva','Isabella AI, Quantum, Kernel y Nexus','#06B6D4','cpu','tech.tamv.online','["isabella","kernel","nexus","quantum"]'),
('salud','Federación de Salud','Bienestar federado','Telesalud, clínicas y monitoreo','#10B981','heart','salud.tamv.online','["telesalud","clinicas"]'),
('comunicacion','Federación de Comunicación','Voz del territorio','Radio, prensa, blog y medios','#EC4899','radio','medios.tamv.online','["radio","prensa","blog"]'),
('gubernamental','Federación Gubernamental','Soberanía digital','Protocolos, EOCT, CITEMESH y nodos','#EF4444','landmark','gob.tamv.online','["protocolos","eoct","citemesh","nodos"]')
ON CONFLICT (id) DO NOTHING;

-- 3) POIs
CREATE TABLE IF NOT EXISTS public.pois (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  category text NOT NULL,
  municipality text NOT NULL DEFAULT 'Real del Monte',
  lat double precision NOT NULL,
  lng double precision NOT NULL,
  altitude_m integer,
  description text,
  significance text,
  federation_id text REFERENCES public.federations(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS pois_category_idx ON public.pois(category);
CREATE INDEX IF NOT EXISTS pois_federation_idx ON public.pois(federation_id);
ALTER TABLE public.pois ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone reads pois" ON public.pois FOR SELECT USING (true);
CREATE POLICY "Admins write pois" ON public.pois FOR ALL TO authenticated
  USING (has_role(auth.uid(),'admin')) WITH CHECK (has_role(auth.uid(),'admin'));

INSERT INTO public.pois (name,category,lat,lng,altitude_m,description,significance,federation_id) VALUES
('Mina de Acosta','mineria',20.1450,-98.6680,2700,'Mina histórica del siglo XVIII, hoy museo','Eje patrimonial minero','cultural'),
('Mina La Rica','mineria',20.1395,-98.6712,2740,'Galería emblemática del corredor minero','Memoria obrera','cultural'),
('Parroquia de la Asunción','templo',20.1437,-98.6691,2710,'Templo principal de Real del Monte','Centro ritual','cultural'),
('Panteón Inglés','ritual',20.1480,-98.6650,2780,'Cementerio metodista de mineros de Cornwall','Memoria migratoria','cultural'),
('Capilla del Señor de Zelontla','templo',20.1420,-98.6730,2690,'Capilla devocional','Ritual local','cultural'),
('Plaza Principal','mercado',20.1432,-98.6694,2700,'Plaza Juárez, corazón cívico','Eje cívico','gubernamental'),
('Mirador Cerro del Judío','geologico',20.1500,-98.6620,2810,'Mirador panorámico','Geoturismo','tecnologica'),
('Bosque El Hiloche','geologico',20.1380,-98.6600,2750,'Bosque de oyamel y encino','Reserva natural','salud'),
('Museo de Medicina Laboral','escuela',20.1445,-98.6685,2705,'Memoria de la salud minera','Educación patrimonial','educativa'),
('Casa Grande','mercado',20.1425,-98.6700,2700,'Antigua casa administrativa de la mina','Patrimonio arquitectónico','economica'),
('Mercado Municipal','mercado',20.1430,-98.6710,2698,'Comercio tradicional de pastes y artesanía','Economía local','economica'),
('Túnel de Dolores','mineria',20.1410,-98.6740,2680,'Bocamina histórica','Patrimonio minero','cultural'),
('Capilla Metodista','templo',20.1455,-98.6660,2720,'Iglesia de origen inglés','Sincretismo cultural','cultural'),
('Centro de Salud RDM','escuela',20.1440,-98.6705,2700,'Servicio de salud comunitario','Atención federada','salud'),
('Escuela Primaria Hidalgo','escuela',20.1428,-98.6685,2700,'Educación pública básica','Eje educativo','educativa'),
('Radio Comunitaria RDM','mercado',20.1435,-98.6695,2702,'Estación de medios local','Voz del territorio','comunicacion'),
('Nodo Cero RDM','escuela',20.1432,-98.6694,2700,'Sede operativa del SO urbano','Kernel federado','tecnologica'),
('Pastelería La Mexicana','mercado',20.1431,-98.6692,2700,'Pastes tradicionales','Identidad gastronómica','economica'),
('Hacienda de Beneficio','mineria',20.1390,-98.6750,2670,'Patio de beneficio colonial','Arqueología industrial','cultural'),
('Cruz del Cerro','ritual',20.1510,-98.6610,2820,'Mirador y sitio ceremonial','Cosmovisión local','cultural');

-- 4) Routes
CREATE TABLE IF NOT EXISTS public.routes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  category text NOT NULL DEFAULT 'turistica',
  description text,
  distance_km numeric,
  duration_min integer,
  geometry jsonb,
  federation_id text REFERENCES public.federations(id) ON DELETE SET NULL,
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.routes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone reads routes" ON public.routes FOR SELECT USING (true);
CREATE POLICY "Admins write routes" ON public.routes FOR ALL TO authenticated
  USING (has_role(auth.uid(),'admin')) WITH CHECK (has_role(auth.uid(),'admin'));

-- 5) Audit signatures
CREATE TABLE IF NOT EXISTS public.audit_signatures (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  resource_type text NOT NULL,
  resource_id text NOT NULL,
  sha256 text NOT NULL,
  signed_by text,
  signed_at timestamptz NOT NULL DEFAULT now(),
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb
);
CREATE INDEX IF NOT EXISTS audit_resource_idx ON public.audit_signatures(resource_type, resource_id);
ALTER TABLE public.audit_signatures ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone reads signatures" ON public.audit_signatures FOR SELECT USING (true);
CREATE POLICY "Admins write signatures" ON public.audit_signatures FOR ALL TO authenticated
  USING (has_role(auth.uid(),'admin')) WITH CHECK (has_role(auth.uid(),'admin'));

-- 6) Repositories
CREATE TABLE IF NOT EXISTS public.repositories (
  id text PRIMARY KEY,
  github_id bigint,
  name text NOT NULL,
  full_name text NOT NULL,
  description text,
  url text NOT NULL,
  homepage text,
  language text,
  topics jsonb NOT NULL DEFAULT '[]'::jsonb,
  stars integer NOT NULL DEFAULT 0,
  forks integer NOT NULL DEFAULT 0,
  size_kb integer NOT NULL DEFAULT 0,
  default_branch text DEFAULT 'main',
  pushed_at timestamptz,
  is_core boolean NOT NULL DEFAULT true,
  federation_id text REFERENCES public.federations(id) ON DELETE SET NULL,
  classification text,
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.repositories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone reads repositories" ON public.repositories FOR SELECT USING (true);
CREATE POLICY "Admins write repositories" ON public.repositories FOR ALL TO authenticated
  USING (has_role(auth.uid(),'admin')) WITH CHECK (has_role(auth.uid(),'admin'));

INSERT INTO public.repositories (id,name,full_name,description,url,language,federation_id,classification) VALUES
('OsoPanda1/rdm-digital-nodo-cero','rdm-digital-nodo-cero','OsoPanda1/rdm-digital-nodo-cero','Kernel SO urbano de Real del Monte','https://github.com/OsoPanda1/rdm-digital-nodo-cero','TypeScript','gubernamental','canónico'),
('OsoPanda1/trueque-mexa','trueque-mexa','OsoPanda1/trueque-mexa','Sistema de trueque federado MSR','https://github.com/OsoPanda1/trueque-mexa','TypeScript','economica','comercio'),
('OsoPanda1/rdm-turismodigital','rdm-turismodigital','OsoPanda1/rdm-turismodigital','Plataforma de turismo digital RDM','https://github.com/OsoPanda1/rdm-turismodigital','TypeScript','economica','comercio'),
('OsoPanda1/real-del-monte-twin','real-del-monte-twin','OsoPanda1/real-del-monte-twin','Gemelo digital del territorio','https://github.com/OsoPanda1/real-del-monte-twin','TypeScript','tecnologica','infra-cognitiva'),
('OsoPanda1/new-beginnings','new-beginnings','OsoPanda1/new-beginnings','Núcleo de génesis ciudadana','https://github.com/OsoPanda1/new-beginnings','TypeScript','gubernamental','protocolo'),
('OsoPanda1/RDM-Digital-X','RDM-Digital-X','OsoPanda1/RDM-Digital-X','RDM Digital experimental X','https://github.com/OsoPanda1/RDM-Digital-X','TypeScript','tecnologica','infra-cognitiva'),
('OsoPanda1/citemesh-roots','citemesh-roots','OsoPanda1/citemesh-roots','Raíces CITEMESH de consentimiento','https://github.com/OsoPanda1/citemesh-roots','TypeScript','gubernamental','protocolo'),
('OsoPanda1/rdm-smart-city-os','rdm-smart-city-os','OsoPanda1/rdm-smart-city-os','SO de ciudad inteligente RDM','https://github.com/OsoPanda1/rdm-smart-city-os','TypeScript','gubernamental','canónico'),
('OsoPanda1/civilizational-core','civilizational-core','OsoPanda1/civilizational-core','Núcleo civilizatorio TAMV','https://github.com/OsoPanda1/civilizational-core','TypeScript','gubernamental','protocolo'),
('OsoPanda1/RDM-DIGITAL2026','RDM-DIGITAL2026','OsoPanda1/RDM-DIGITAL2026','RDM Digital 2026 release','https://github.com/OsoPanda1/RDM-DIGITAL2026','TypeScript','gubernamental','canónico'),
('OsoPanda1/real-del-monte-explorer','real-del-monte-explorer','OsoPanda1/real-del-monte-explorer','Explorador territorial RDM','https://github.com/OsoPanda1/real-del-monte-explorer','TypeScript','economica','comercio'),
('OsoPanda1/real-del-monte-elevated','real-del-monte-elevated','OsoPanda1/real-del-monte-elevated','RDM elevated experience','https://github.com/OsoPanda1/real-del-monte-elevated','TypeScript','cultural','manuscrito'),
('OsoPanda1/real-del-monte-explorer-11b3982a','real-del-monte-explorer-11b3982a','OsoPanda1/real-del-monte-explorer-11b3982a','Explorador RDM (variante)','https://github.com/OsoPanda1/real-del-monte-explorer-11b3982a','TypeScript','economica','comercio')
ON CONFLICT (id) DO NOTHING;

-- 7) Extend businesses
ALTER TABLE public.businesses
  ADD COLUMN IF NOT EXISTS commerce_type text NOT NULL DEFAULT 'general',
  ADD COLUMN IF NOT EXISTS monthly_fee_cents integer NOT NULL DEFAULT 20000,
  ADD COLUMN IF NOT EXISTS payment_status text NOT NULL DEFAULT 'inactive',
  ADD COLUMN IF NOT EXISTS next_payment_due timestamptz;

-- 8) Extend handle_new_user trigger for tourist|merchant|operator|admin
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  requested_role text;
  resolved_role text;
BEGIN
  requested_role := COALESCE(NEW.raw_user_meta_data->>'role', 'tourist');
  resolved_role := CASE
    WHEN requested_role IN ('tourist','merchant','operator','admin') THEN requested_role
    ELSE 'tourist'
  END;

  INSERT INTO public.profiles (id, name, email, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.raw_user_meta_data->>'full_name', ''),
    NEW.email,
    resolved_role
  )
  ON CONFLICT (id) DO NOTHING;

  -- Map non-admin roles to user_roles using app_role
  IF resolved_role = 'admin' THEN
    -- Never auto-grant admin from signup metadata; admins must be promoted manually.
    NULL;
  ELSE
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'user'::app_role)
    ON CONFLICT (user_id, role) DO NOTHING;
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
