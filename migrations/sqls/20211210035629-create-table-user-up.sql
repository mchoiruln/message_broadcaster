CREATE TABLE "users" (
	id serial NOT NULL primary key,
	firstname varchar NOT NULL,
	lastname varchar NULL,
	birthday_date date NOT NULL,
	"location" varchar NOT NULL,
  zone varchar NOT NULL,
	scheduled timestamptz(0) NULL,
  status varchar NOT null default 'UNCELEBRATED',
  last_updated_lock timestamptz(0) NULL default now()
);

