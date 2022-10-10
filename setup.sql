CREATE DATABASE DILIGENT
GO

USE DILIGENT
GO
-- Drop a table called 'products' in schema 'dbo'
-- Drop the table if it already exists
IF OBJECT_ID('[dbo].[products]', 'U') IS NOT NULL
DROP TABLE [dbo].[products]
GO
CREATE TABLE [dbo].[products] 
(
    id int IDENTITY(1,1),
    product_name nvarchar(450) UNIQUE not null, 
    product_price DECIMAL(10,2)  not null, 
    product_description nvarchar(max) null
)

IF OBJECT_ID('[dbo].[recent]', 'U') IS NOT NULL
DROP TABLE [dbo].[recent]
GO
CREATE TABLE [dbo].[recent] 
(
    id int IDENTITY(1,1),
    product_id int not null,
    product_name nvarchar(450) UNIQUE not null,
    read_count int not null 
)


