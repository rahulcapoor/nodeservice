    
select * from [dbo].[products] 

select * from recent

DECLARE @COUNT int = 5
select top 100 *
from recent 
where read_count > 0 
order by read_count desc


declare @product_name varchar(450) = 'test2'
insert into [dbo].[recent] (product_id, product_name, read_count) 
values((select id from dbo.products where product_name = @product_name), @product_name, 1)

declare @count int = 1
select top $count pr.id, pr.product_name, pr.product_description, re.read_count from dbo.products pr
join dbo.recent re on pr.id = re.product_id
where re.read_count > 0 
order by  re.read_count desc

declare @product_name varchar(450) = 'test2'
if (select read_count from dbo.recent where product_name = @product_name) > 0
        update dbo.recent  set read_count = read_count+1 where product_name = @product_name
        else
        insert into [dbo].[recent] (product_id, product_name, read_count) 
        values((select id from dbo.products where product_name = @product_name), @product_name, 1)


        declare @product_name varchar(450) = 'test2'
if (select read_count from dbo.recent where product_name = @product_name) > 0
        update dbo.recent  set read_count = read_count+1 where product_name = @product_name
        else
        if EXISTS(select id from dbo.products where product_name = @product_name)
            insert into [dbo].[recent] (product_id, product_name, read_count) 
            values((select id from dbo.products where product_name = @product_name), @product_name, 1)

