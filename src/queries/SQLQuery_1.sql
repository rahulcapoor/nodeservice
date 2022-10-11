USE master
GO

IF NOT EXISTS (
    SELECT [name]
        FROM sys.databases
        WHERE [name] = N'DILIGENT'
)
CREATE DATABASE DILIGENT
GO
ß

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



IF OBJECT_ID('[dbo].[Products_Audit]', 'U') IS NOT NULL
DROP TABLE [dbo].[Products_Audit]
GO

CREATE TABLE [dbo].[Products_Audit]
(
    [Audit_Id] INT IDENTITY(1,1) PRIMARY KEY,
    [Audit_product_id] int not null, 
    [Audit_product_name] nvarchar(450) not null, 
    [Audit_product_price] DECIMAL(10,2)  not null, 
    [Audit_product_description] nvarchar(max) null ,
    [Audit_ActionType] char(1),
    [Audit_Username] varchar(100),
    [Aud_OperationDate] datetime DEFAULT GETDATE()
);
GO

CREATE TRIGGER dbo.trg_products_audit
ON dbo.products
AFTER INSERT, DELETE
AS
BEGIN
    SET NOCOUNT ON;
    INSERT INTO [dbo].[Products_Audit](
        Audit_product_id,
        Audit_product_name, 
        Audit_product_price,
        Audit_product_description,
        Audit_ActionType,
        Audit_Username
    )
    SELECT
        i.id,
        i.product_name,
        i.product_price,
        i.product_description,
        'I',
        USER_NAME()
    FROM
        inserted i
    UNION ALL
    SELECT
        d.id,
        d.product_name,
        d.product_price,
        d.product_description,
        'D',
         USER_NAME()
    FROM
        deleted d;
END



