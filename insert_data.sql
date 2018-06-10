insert into towns (town_name, town_tag) values ('Cape Town', 'CA');
insert into towns (town_name, town_tag) values ('George', 'CAW');
insert into towns (town_name, town_tag) values ('Paarl', 'CJ');
insert into towns (town_name, town_tag) values ('Stellenbosch', 'CL');

insert into reg_numbers (reg_number, town) values ('CA 234-543', 1);
insert into reg_numbers (reg_number, town) values ('CJ 432-543', 3);
insert into reg_numbers (reg_number, town) values ('CL 234-098', 4);
insert into reg_numbers (reg_number, town) values ('CAW 623-543', 2);

select * from towns;
select * from reg_numbers;
