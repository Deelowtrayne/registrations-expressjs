drop table if exists towns, reg_numbers;

--  towns table
create table towns (
    id serial not null primary key,
    town_name varchar(50) not null,
    town_tag varchar(20) not null
);
--  registrations table
create table reg_numbers (
    id serial not null primary key,
    reg_number varchar(50) not null,
    town int not null,
    foreign key (town) references towns(id)
);
