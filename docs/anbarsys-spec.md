# A. SystemOverview 

###### **A. SystemOverview** 

**1. Project Purpose** 

**2. Business Background** 

**3. System Goals** 

**4. Scope** 

**5. Out of Scope** 

**6. Design Principles** 

**7. Core Concepts** 

**8. System Architecture Overview** 

**9. Physical Infrastructure** 

**10. Software Modules** 

**11. User Roles** 

**12. High-Level Business Flow** 

**13. Traceability Concept** 

**14. Session-Based Operation Model 15. Configuration Philosophy 16. Version 1 Boundaries 17. Future Expansion Strategy** 

##### **1. Project Purpose** 

###### **1.1 Purpose** 

The purpose of this project is to design and develop a warehouse and production management system specifically tailored for a truffle and freeze-dried food processing company. 

Unlike traditional ERP or warehouse management systems, this solution is designed around the actual operational workflow of the factory, where products continuously move between receiving, cold storage, sorting, washing, processing, packaging and export preparation. 

The system is intended to provide complete operational visibility while remaining simple enough for factory operators to use with minimal training. 

###### **1.2 Business Problem** 

The current operation consists of multiple independent manual processes. 

Products are received from different suppliers, temporarily stored, sorted several days later, mixed during production, processed through different manufacturing lines and finally packed for export. 

The existing workflow creates several challenges: 

- Limited traceability between incoming and outgoing products. 

- Manual recording of weights. 

- No centralized production history. 

- Difficulty identifying product location. 

- Difficulty tracking operator activities. 

- Manual labeling. 

- No real-time production status. 

- High dependency on operator experience. 

- Difficult management of partially completed operations. 

- Limited visibility for production managers. 

The objective of this system is to eliminate these operational limitations without increasing process complexity. 

##### **1.3 Project Objectives** 

The system has been designed to achieve the following objectives: 

###### Complete Product Traceability 

Every movement of every product must be traceable from receiving until shipment. 

The system shall maintain production history even when products are mixed during sorting or processing. 

Exact harvest date traceability is not required. 

Harvest Period (for example "First Week of July") is sufficient. 

###### Digital Production Workflow 

All production activities shall be digitally recorded. 

Including: 

- Receiving 

- Sorting 

- Washing 

- Slicing 

- Freezing 

- Freeze Drying 

- Conventional Drying 

- Packaging 

- Shipping 

No manual production records should be required. 

###### Real-Time Inventory Visibility 

At any moment the system shall identify: 

- Current Zone 

- Current Container 

- Current Batch Status 

- Current Weight 

- Current Production Stage 

###### Minimize Operator Interaction 

The system is designed around barcode scanning instead of manual data entry. 

Operators should perform their tasks primarily by: 

- Scanning QR Codes 

- Using digital scales 

- Selecting predefined options 

Typing should be minimized. 

###### Flexible Product Configuration 

The system shall allow administrators to add or modify: 

- Product Grades 

- Product Sizes 

- Package Types 

- Processing Rules 

- Storage Rules 

- Production Parameters 

without requiring software modification. 

###### Production-Oriented Design 

The software is not intended to mimic a generic ERP. 

Instead, every screen and workflow reflects the real operational sequence of the factory. 

###### Session-Based Operations 

Every production activity is executed inside an operational Session. 

A Session automatically saves progress. 

Only after successful validation does the Session generate permanent production records. 

This design prevents incomplete transactions while allowing recovery after power loss or application interruption. 

###### Intelligent Task Management 

Operators do not manually search for work. 

The system provides: 

- My Tasks 

- Recommended Next Task 

- QR-Based Task Recognition 

Managers may override priorities whenever necessary. 

###### Exception-Driven Management 

Managers should not monitor every operation. 

Instead, the dashboard shall primarily display exceptions such as: 

- Delayed batches 

- Missing labels 

- Weight anomalies 

- Capacity warnings 

- Pending approvals 

- Equipment issues 

Management attention should focus only on situations requiring decisions. 

###### Simple Physical Workflow 

The software shall adapt to the factory rather than forcing factory redesign. 

Key design principles include: 

- No warehouse shelf structure. 

- Zone-based tracking. 

- Single-product containers. 

- Mixed shipping packages allowed. 

- Configurable production rules. 

- Warning-based validation instead of blocking operations. 

##### **1.4 Expected Benefits** 

Implementation of this system is expected to provide: 

- Complete operational visibility. 

- End-to-end product traceability. 

- Reduced human error. 

- Faster operator training. 

- Reduced paperwork. 

- Accurate inventory status. 

- Digital production history. 

- Simplified export preparation. 

- Improved management reporting. 

- Better production planning. 

- Higher operational consistency. 

- Scalable architecture for future expansion. 

###### **Design Principle** 

**The primary objective of this system is not to digitize paperwork.** 

**Its objective is to digitize factory operations while keeping the workflow as close as possible to the real-world production process.** 

##### **2. Business Background** 

###### **2.1 Company Profile** 

The company specializes in the procurement, processing, storage, packaging, and international export of premium truffles and freeze-dried food products. 

The production environment is significantly different from a conventional food factory. Products are highly seasonal, quality varies naturally between suppliers, product weight changes during storage and processing, and multiple processing routes may exist for the same incoming material. 

Because of these characteristics, traditional ERP or Warehouse Management Systems (WMS) cannot accurately represent the actual production workflow without significant customization. 

The proposed system has therefore been designed specifically around the company's operational processes rather than adapting the factory to fit generic software. 

##### **2.2 Business Operations** 

The factory handles multiple product categories within a single operational platform. 

###### Fresh Products 

- Fresh Truffle 

- Fresh Fruits 

###### Frozen Products 

- Frozen Truffle 

- Frozen Fruits 

###### Processed Products 

- Freeze-Dried Truffle 

- Conventionally Dried Truffle 

- Freeze-Dried Fruits 

- Other processed food products 

Each product category follows its own processing path while sharing common operational principles such as receiving, traceability, quality control, packaging, and shipment. 

##### **2.3 Procurement Process** 

Products are received from multiple suppliers. 

Each supplier is settled financially based only on the quantity and quality delivered at receiving. 

Supplier settlement is independent from later production losses, storage shrinkage, processing yield, or shipment composition. 

Each receiving operation creates an independent production batch. 

At the receiving stage: 

- Only one product is accepted per receiving unit. 

- Only one quality grade is allowed per receiving unit. 

- Only one size category is allowed per receiving unit. 

- Receiving weight is considered the commercial weight for supplier settlement. 

##### **2.4 Production Characteristics** 

Unlike conventional manufacturing, production is not continuous. 

Products may remain inside cold storage for several days before processing begins. 

Processing schedules depend on: 

- Customer orders 

- Available machine capacity 

- Seasonal demand 

- Product quality 

- Production planning 

The system must therefore support variable waiting periods without affecting product traceability. 

##### **2.5 Product Sorting** 

Fresh truffles are generally received in broad size categories. 

After receiving, products are transferred to the sorting area where they are separated into the company's commercial grades. 

Sorting determines the final production destination. 

Depending on operational requirements, sorted products may be assigned to: 

- Export as fresh product 

- Freeze processing 

- Freeze drying 

- Conventional drying 

Sorting represents the first major transformation step in production. 

##### **2.6 Product Mixing** 

The factory intentionally allows controlled product mixing. 

Examples include: 

- Remaining product from one production day may be combined with product received on later days. 

- Freeze dryer loads may be completed using material from multiple receiving batches. 

- Fresh export nets may contain product originating from multiple supplier batches. 

- Shipping cartons may contain different processed products and different quality grades. 

This behavior is considered a normal business process. 

The system is not required to preserve one-to-one traceability after mixing. 

Instead, it shall preserve parent-child batch relationships. 

This allows complete production genealogy without requiring physical batch separation. 

##### **2.7 Harvest Traceability** 

The business does not require exact harvest dates for exported products. 

Instead, traceability is maintained using Harvest Periods such as: 

- First Week of July 

- Second Week of July 

- Third Week of August 

This level of traceability is sufficient for business requirements while significantly simplifying production management. 

##### **2.8 Weight Characteristics** 

Weight is a dynamic property throughout production. 

Examples include: 

- Fresh truffle naturally loses weight during cold storage. 

- Washing may temporarily increase product weight. 

- Frozen products may gain weight after washing due to absorbed surface moisture. 

- Drying and freeze drying significantly reduce weight. 

- Packaging may combine multiple production batches. 

For this reason, the system shall never assume that a batch has a fixed weight. 

Every important production stage may generate a new official measurement. 

Historical measurements shall never be overwritten. 

##### **2.9 Packaging Philosophy** 

Packaging is performed in multiple levels. 

Individual consumer packages receive unique identification and labels. 

Shipping packages may contain multiple consumer packages or multiple product grades. 

Examples include: 

- Metallized pouch 

- Export carton 

- EPS (polystyrene) shipping box 

- Pallet 

Shipping packages are logistics units rather than production batches. 

Their primary purpose is transportation and shipment organization. 

##### **2.10 Production Environment** 

The factory intentionally avoids complex warehouse structures. 

Products are managed using operational Zones instead of warehouse shelves or storage bins. 

Typical Zones include: 

- Receiving 

- Cold Room 

- ● Sorting ● Washing ● Slicing ● Freezing ● Freeze Drying ● Conventional Drying ● Packaging ● Shipping ● Quarantine 

- Waste 

Each physical container belongs to only one Zone at a time. 

Movement between Zones represents production progress. 

##### **2.11 Operational Philosophy** 

The system has been designed according to the following business principles: 

- Factory workflow has priority over software conventions. 

- ● Simplicity is preferred over excessive automation. 

- Warnings are preferred over blocking operations whenever possible. 

- ● Configuration is preferred over software customization. 

- Product traceability is maintained without forcing unnecessary operational constraints. 

- Operators interact primarily through QR code scanning and digital weighing. 

- Every operation must be recoverable after interruption. 

- Every important production event must be historically traceable. 

##### **2.12 Overall Vision** 

The objective of this project is not merely to build an inventory system. 

The objective is to create a digital operational platform capable of representing the complete production lifecycle of truffles and freeze-dried products, from supplier receiving through processing, packaging, warehouse management, and export shipment. 

The platform is intended to become the central operational system for the factory, supporting both daily production activities and long-term traceability requirements while remaining simple enough to be adopted by production operators with minimal training. 

##### **3. System Goals** 

###### **3.1 Purpose** 

The primary goal of the system is to establish a single digital platform that manages the complete operational lifecycle of products from receiving through production, packaging, warehouse management, and shipment. 

The system is designed to improve operational visibility, product traceability, production efficiency, and management decision-making while maintaining a simple workflow for factory operators. 

##### **3.2 Primary Goals** 

###### **Goal 1 — End-to-End Product Traceability** 

The system shall maintain complete traceability throughout the product lifecycle. 

Every product shall be traceable from supplier receiving until final shipment. 

Traceability shall include: 

- Supplier 

- Receiving Batch 

- Processing History 

- Mixing History 

- Packaging History 

- Shipment History 

- Operator History 

- Measurement History 

- Location History 

Even when products are intentionally mixed during sorting or production, the genealogy between parent and child batches shall be preserved. 

###### **Goal 2 — Digital Production Management** 

All production activities shall be digitally managed. 

The system shall replace manual recording for: 

- Receiving 

- Sorting 

- Washing 

- Slicing 

- Freezing 

- Freeze Drying 

- Conventional Drying 

- Packaging 

- Shipping 

Each production step shall generate digital operational records. 

###### **Goal 3 — Real-Time Inventory Visibility** 

Management shall always know: 

- What products exist 

- Current quantity 

- Current weight 

- Current Zone 

- Current processing stage 

- Current package 

- Current shipment status 

No manual inventory reconciliation should be required during normal operations. 

###### **Goal 4 — Session-Based Operations** 

Every operational process shall execute inside a Session. 

Sessions shall support: 

- Auto Save 

- Resume after interruption 

- Validation before completion 

- Recovery after power failure 

- Complete audit history 

Permanent records shall only be generated after successful Session completion. 

###### **Goal 5 — Simple Operator Experience** 

The software shall minimize keyboard interaction. 

Operators should perform most activities using: 

- QR code scanning 

- Digital weighing 

- Simple button selection 

- Task confirmation 

Manual typing shall be limited to exceptional situations. 

###### **Goal 6 — Flexible Product Configuration** 

Business users shall be able to configure: 

- Product Grades 

- Product Sizes 

- Package Types 

- Processing Parameters 

- Zone Rules 

- Quality Rules 

- Validation Limits 

without software development. 

Configuration changes shall become effective immediately after activation. 

###### **Goal 7 — Factory-Oriented Workflow** 

The software shall adapt to the factory workflow rather than requiring operational changes. 

Examples include: 

- Zone-based inventory 

- Single-product receiving containers 

- Mixed shipment packages 

- Dynamic production routing 

- Flexible processing schedules 

The software shall support existing factory operations with minimal process modification. 

###### **Goal 8 — Intelligent Task Management** 

Operators shall receive work directly from the system. 

Task assignment shall support: 

- Automatic assignment 

- Manual assignment 

- Self-selection (where permitted) 

Each task shall include: 

- Priority 

- Current Status 

- Assigned Operator 

- Processing Zone 

- Required Action 

###### **Goal 9 — Mobile Operation** 

The system shall support two types of operational terminals: 

###### Fixed Production Terminal 

Hardware: 

- Raspberry Pi 

- Barcode Scanner 

- Digital Scale 

- Label Printer 

Used primarily for: 

- Receiving 

- Weighing 

- Label Printing 

###### Mobile Industrial PDA 

Android-based industrial scanner used for: 

- QR Scanning 

- Task Execution 

- Zone Transfers 

- Production Operations 

- Quality Confirmation 

Mobile devices shall not require printers. 

Whenever printing is required, operators shall use the nearest fixed production terminal. 

###### **Goal 10 — Print Management** 

Printing shall be treated as an independent service. 

The system shall support: 

- Automatic label generation 

- Pending print queue 

- Reprint 

- Print history 

- Printer failure recovery 

Production shall continue even if printing is temporarily unavailable, subject to configurable business rules. 

###### **Goal 11 — Audit & Compliance** 

Every significant operational event shall be permanently recorded. 

Examples include: 

- Receiving 

- Weight Measurement 

- Batch Creation 

- Batch Mixing 

- Zone Transfer 

- Processing 

- Packaging 

- Shipment 

- Label Printing 

- Quality Approval 

Historical records shall never be deleted. 

###### **Goal 12 — Exception-Based Management** 

Managers should focus on operational exceptions instead of routine production. 

The dashboard shall highlight: 

- Delayed batches 

- Overdue tasks 

- Missing labels 

- Weight anomalies 

- Zone capacity warnings 

- Equipment issues 

- Pending approvals 

- Validation warnings 

Routine operations should require minimal managerial intervention. 

###### **Goal 13 — Decision Support** 

The system shall assist managers by providing operational recommendations such as: 

- FIFO-based processing order 

- Priority overrides 

- Recommended washing sequence 

- Recommended processing sequence 

- Recommended shipment preparation 

Final decisions shall always remain under managerial control. 

###### **Goal 14 — Scalability** 

The architecture shall support future expansion without major redesign. 

Potential future modules include: 

- ERP Integration 

- Accounting Integration 

- CRM Integration 

- Laboratory Management 

- Machine Monitoring 

- IoT Sensors 

- AI-Based Production Planning 

- Predictive Maintenance 

- Customer Portal 

The Version 1 implementation shall remain simple while providing a solid architectural foundation. 

##### **3.3 Non-Goals (Version 1)** 

The following features are intentionally excluded from Version 1: 

- Financial accounting 

- Payroll 

- Human Resources 

- Procurement Management 

- Customer Relationship Management (CRM) 

- Sales Order Management 

- Production Cost Calculation 

- Automated Machine Control 

- IoT Sensor Integration 

- Artificial Intelligence Decision Engine 

These capabilities may be introduced in future versions without requiring redesign of the core data model. 

##### **3.4 Success Criteria** 

The project shall be considered successful if it achieves the following measurable outcomes: 

- 100% digital recording of production operations. 

- Complete traceability from receiving to shipment. 

- Real-time visibility of inventory and production status. 

- Significant reduction in manual paperwork. 

- Reduction of operator input errors through QR-based workflows. 

- Recovery from interrupted operations without data loss. 

- Rapid onboarding of new operators through simplified workflows. 

- Configurable business rules without software modification. 

- Reliable management reporting based on accurate operational data. 

##### **3.5 Guiding Principle** 

The guiding principle of this system is: 

###### **The software must simplify factory operations—not complicate them.** 

Every design decision shall prioritize operational simplicity, data integrity, traceability, and long-term maintainability over unnecessary technical complexity. 

## **4. Scope** 

#### **4.1 Purpose** 

This section defines the functional boundaries of Version 1 (V1) of the Warehouse and Production Management System. 

The objective is to clearly identify which business processes are included in the project and which are intentionally excluded. 

Defining the project scope ensures that the implementation remains focused, achievable, and aligned with operational priorities. 

## **4.2 In Scope** 

The following business capabilities are included in Version 1. 

## **4.2.1 Master Data Management** 

The system shall provide configurable master data for: 

- Products 

- Product Categories 

- Product Grades 

- Product Sizes 

- Suppliers 

- Production Processes 

- Package Types 

- Zones 

- Devices 

- Scales 

- Operators 

- Roles 

- Skills 

- System Configuration 

Business administrators shall be able to modify configurable values without software development. 

## **4.2.2 Receiving Management** 

The system shall support receiving of: 

- Fresh Truffle 

- Frozen Truffle 

- Fresh Fruits 

- Frozen Fruits 

- Freeze-Dried Products 

- Conventionally Dried Products 

- Packaged Products 

Receiving includes: 

- Supplier selection 

- Product selection 

- Grade selection 

- Size selection 

- Container assignment 

- Digital weighing 

- Batch creation 

- QR code generation (when applicable) 

- Session-based receiving workflow 

Each receiving unit shall contain only: 

- One Product 

- One Grade 

- One Size 

## **4.2.3 Batch Management** 

The system shall manage production batches throughout their lifecycle. 

Capabilities include: 

- Batch creation 

- Batch splitting 

- Batch merging 

- Parent-child relationships 

- Batch genealogy 

- Status tracking 

- Production routing 

Batch history shall remain permanently available. 

## **4.2.4 Container Management** 

The system shall manage reusable physical containers. 

Supported container types include: 

- Plastic Basket 

- Plastic Crate 

- Other reusable containers 

Each container shall: 

- Have a permanent QR Code 

- Contain only one product batch at a time 

- Maintain movement history 

- Maintain cleaning status 

- Maintain operational status 

## **4.2.5 Zone Management** 

The warehouse shall be managed using operational Zones instead of shelves. 

Supported Zones include: 

- Receiving 

- Cold Room 

- Sorting 

- Washing 

- Slicing 

- Freezing 

- Freeze Drying 

- Conventional Drying 

- Packaging 

- Shipping 

- Quarantine 

- Waste 

Movement between Zones represents operational progress. 

## **4.2.6 Production Operations** 

The system shall support: 

- Sorting 

- Washing 

- Slicing 

- Freezing 

- Freeze Drying 

- Conventional Drying 

- Packaging 

- Shipment Preparation 

Each operation shall be executed using Session-based workflows. 

## **4.2.7 Weight Management** 

The system shall support: 

- Digital scale integration 

- Multiple measurements per batch 

- Historical measurements 

- Weight tolerance validation 

- Warning generation 

- Manual weight entry (authorized users only) 

Measurements shall never overwrite previous records. 

## **4.2.8 Packaging Management** 

The system shall support: 

Individual Packages 

- Metallized Pouches 

Shipping Packages 

- Export Cartons 

- EPS Boxes 

- Pallets 

Capabilities include: 

- Package creation 

- Package hierarchy 

- Package content management 

- Package QR codes 

- Label generation 

- Repacking operations 

Shipping packages may contain multiple products or multiple quality grades. 

## **4.2.9 Label Printing** 

The system shall support: 

- QR Label Printing 

- Carton Labels 

- EPS Labels 

- Product Labels 

- Print Queue 

- Reprint 

- Print History 

Printing shall be independent from operational workflow. 

## **4.2.10 Task Management** 

The system shall support: 

- Work Orders 

- Tasks 

- Automatic Assignment 

- Manual Assignment 

- Self Assignment 

- Task Locking 

- Task Recovery 

- Priority Management 

- Task Dashboard 

## **4.2.11 Mobile Operations** 

The system shall support Android industrial handheld scanners. 

Supported activities include: 

- QR Scanning 

- Task Execution 

- Zone Transfer 

- Production Confirmation 

- Quality Confirmation 

Printing operations shall be performed using fixed production terminals. 

## **4.2.12 Fixed Production Terminal** 

The Raspberry Pi production terminal shall support: 

- Barcode Scanner 

- Digital Scale 

- Label Printer 

Supported activities include: 

- Receiving 

- Weighing 

- Label Printing 

- Reprinting 

- Batch Confirmation 

## **4.2.13 Traceability** 

The system shall maintain: 

- Supplier Traceability 

- Batch Traceability 

- Processing Traceability 

- Packaging Traceability 

- Shipment Traceability 

- Operator Traceability 

- Equipment Traceability 

- Measurement History 

- Zone History 

Traceability shall remain available throughout the product lifecycle. 

## **4.2.14 Shipment Preparation** 

The system shall support preparation of export shipments. 

Capabilities include: 

- EPS Assembly 

- Carton Assembly 

- Pallet Building 

- Shipment Composition 

- Shipment Validation 

- Shipment History 

The system shall record package composition but shall not manage transportation logistics. 

## **4.2.15 Audit Trail** 

Every important business event shall be permanently recorded. 

Examples include: 

- Receiving 

- Weighing 

- Sorting 

- Washing 

- Freeze Drying 

- Packaging 

- Printing 

- Shipment 

- Quality Approval 

- Zone Movement 

Deletion of historical operational records shall not be permitted. 

## **4.2.16 Dashboards & Reporting** 

Version 1 shall include dashboards for: 

Operators 

- My Tasks 

- Current Session 

- Pending Operations 

Managers 

- Production Status 

- Zone Capacity 

- Delayed Batches 

- Pending Labels 

- Weight Warnings 

- Equipment Status 

- Exception Dashboard 

Basic operational reports shall also be available. 

## **4.3 Out of Scope** 

The following capabilities are intentionally excluded from Version 1. 

#### **Business Systems** 

- Financial Accounting 

- Payroll 

- HR Management 

- Procurement 

- CRM 

- Sales Management 

- Customer Portal 

#### **Manufacturing** 

- Automatic Machine Control 

- PLC Integration 

- Machine Scheduling 

● Predictive Maintenance 

#### **Advanced Analytics** 

- AI Production Optimization 

- Demand Forecasting 

- Machine Learning 

- Image Recognition 

#### **External Integration** 

- ERP Integration 

- Accounting Software Integration 

- Government Systems 

- Banking Systems 

- Customs Systems 

- Shipping Company APIs 

#### **Laboratory** 

- Laboratory Information Management (LIMS) 

- Microbiological Testing 

- Chemical Analysis 

- Certificate Generation 

#### **IoT** 

- Wireless Sensors 

- Temperature Logging 

- Humidity Monitoring 

- GPS Tracking 

## **4.4 Scope Boundaries** 

The system is designed to manage operational execution inside the factory. 

Version 1 begins when products are physically received by the warehouse and ends when finished packages are prepared for shipment. 

Processes occurring before receiving (supplier procurement) and after shipment (transportation, customs clearance, customer delivery, financial settlement) are outside the scope of this project. 

## **4.5 Scope Philosophy** 

Version 1 prioritizes operational simplicity and implementation success. 

The objective is to deliver a reliable operational platform that accurately reflects the factory workflow while avoiding unnecessary complexity. 

Future versions may extend the platform through additional modules without requiring redesign of the core architecture. 

## **4.6 Multi-Site Operations** 

Version 1 shall support three independent operational sites: the Iran factory (full processing), and two warehouse sites (Dubai, Rome) primarily for storage, occasional QC, and repacking. Each site owns exclusive write access to its own physical inventory. Transfers between sites are recorded as a Shipment at the source site and a corresponding Receiving (Source=Internal Transfer) at the destination site. The Iran site must remain fully operational during international internet outages, queuing events locally until connectivity is restored. 

## **5. Out of Scope** 

#### **5.1 Purpose** 

This section defines the functions and business processes that are intentionally excluded from Version 1 (V1) of the Warehouse and Production Management System. 

The purpose of this section is to prevent scope expansion during development and ensure that implementation remains focused on the factory's core operational requirements. 

The exclusion of these features does not imply that they are unnecessary. They may be implemented in future versions without requiring redesign of the system architecture. 

## **5.2 Financial Management** 

The following financial capabilities are outside the scope of Version 1: 

- General Ledger (GL) 

- Accounts Receivable (AR) 

- Accounts Payable (AP) 

- Cash Management 

- Bank Reconciliation 

- Budgeting 

- Cost Accounting 

- Profit & Loss Statements 

- Tax Management 

- Financial Reporting 

Version 1 records operational data only and shall not perform financial accounting. 

## **5.3 Supplier Procurement** 

The system shall not manage supplier purchasing activities. 

Excluded features include: 

- Purchase Requests 

- Purchase Orders 

- Supplier Quotations 

- Procurement Approval Workflow 

- Supplier Contracts 

- Supplier Performance Evaluation 

Supplier information is maintained only for operational traceability and receiving records. 

## **5.4 Customer & Sales Management** 

Version 1 does not include Customer Relationship Management (CRM). 

Excluded capabilities include: 

- Customer Database Management 

- Sales Opportunities 

- Sales Quotations 

- Sales Orders 

- Pricing Management 

- Discount Management 

- Customer Support 

- Customer Communication 

- Marketing Activities 

The system focuses on production execution rather than commercial activities. 

## **5.5 Human Resources** 

The following HR functions are excluded: 

- Employee Records 

- Payroll 

- Attendance Management 

- Leave Requests 

- Performance Reviews 

- Recruitment 

- Training Management 

The system only stores operational operator information required for production activities. 

## **5.6 Production Planning** 

Advanced production planning is not included. 

Excluded capabilities include: 

- Capacity Planning 

- Material Requirements Planning (MRP) 

- Production Forecasting 

- Automatic Production Scheduling 

- Machine Load Balancing 

- Shift Optimization 

Managers remain responsible for production planning decisions. 

## **5.7 Machine Automation** 

The system shall not directly control production equipment. 

Excluded capabilities include: 

- PLC Communication 

- Machine Start/Stop Commands 

- Automatic Process Control 

- Industrial Automation 

- SCADA Integration 

- Conveyor Control 

- Robot Control 

Version 1 records operational events but does not control machinery. 

## **5.8 IoT & Sensor Integration** 

The following are excluded: 

- Temperature Sensors 

- Humidity Sensors 

- Energy Monitoring 

- GPS Tracking 

- Environmental Monitoring 

- Real-Time Sensor Data Collection 

- Automatic Alarm Generation from Sensors 

These capabilities may be integrated in future releases. 

## **5.9 Laboratory Management** 

Laboratory Information Management is excluded. 

Examples include: 

- Microbiological Testing 

- Chemical Analysis 

- Moisture Analysis 

- Sample Tracking 

- Laboratory Equipment Integration 

- Certificate of Analysis (COA) Generation 

Quality Control in Version 1 is limited to operational approvals and inspections. 

## **5.10 Transportation Management** 

The system does not manage logistics after shipment preparation. 

Excluded capabilities include: 

- Vehicle Scheduling 

- Route Planning 

- Driver Management 

- Freight Cost Calculation 

- GPS Vehicle Tracking 

- Delivery Confirmation 

- Customs Documentation 

- International Freight Management 

Version 1 ends when shipment packages are prepared and released for dispatch. 

## **5.11 E-Commerce & Customer Portal** 

Version 1 does not provide online customer services. 

Excluded features include: 

- Customer Portal 

- Online Ordering 

- Order Tracking 

- Payment Gateway 

- Product Catalog Website 

- Distributor Portal 

- Mobile Customer Application 

## **5.12 Artificial Intelligence** 

The following AI capabilities are intentionally excluded: 

- Demand Forecasting 

- Yield Prediction 

- Automatic Production Optimization 

- Predictive Inventory Planning 

- Intelligent Quality Classification 

- Machine Vision 

- AI-Based Decision Making 

The system may provide operational recommendations based on business rules but shall not make autonomous business decisions. 

## **5.13 Business Intelligence** 

Advanced analytics are outside the scope. 

Excluded features include: 

- Data Warehouse 

- OLAP Cubes 

- Predictive Analytics 

- Executive BI Dashboards 

- KPI Forecasting 

- Advanced Trend Analysis 

Version 1 includes only operational reports and management dashboards. 

## **5.14 ERP Integration** 

No external ERP integration is included. 

Examples include: 

- SAP 

- Microsoft Dynamics 

- Oracle ERP 

- Odoo 

- Sage 

- QuickBooks 

- Other Accounting Systems 

The architecture shall remain integration-ready, but implementation is deferred. 

## **5.15 Multi-Company Support** 

Version 1 supports a single legal entity and a single factory. 

Excluded capabilities include: 

- Multi-Company Operations 

- Intercompany Transactions 

- Consolidated Reporting 

- Shared Inventory Between Companies 

These capabilities may be introduced in future versions if required. 

## **5.16 Product Formulation** 

Version 1 does not include recipe or formulation management. 

Excluded capabilities include: 

- Bill of Materials (BOM) 

- Recipe Version Control 

- Ingredient Cost Calculation 

- Formula Approval Workflow 

Production operations assume that process instructions are defined externally. 

## **5.17 Regulatory Documentation** 

The following documentation is outside the system scope: 

- Export Certificates 

- Health Certificates 

- Customs Documents 

- Commercial Invoices 

- Packing Lists 

- Regulatory Compliance Documents 

These documents may reference system data but are generated outside Version 1. 

## **5.18 Design Philosophy** 

Every excluded feature has been intentionally deferred to protect the project's primary objective: 

###### **Build a stable, simple, and production-focused operational platform before expanding into enterprise-wide business management.** 

The success of Version 1 will be measured by its reliability in supporting daily factory operations, not by the number of enterprise features it contains. 

Future versions can extend the platform through modular additions without requiring changes to the core database structure or operational workflows. 

## **6. Design Principles** 

#### **6.1 Purpose** 

This section defines the architectural and operational principles that guide the design and implementation of the Warehouse and Production Management System. 

These principles serve as mandatory design rules throughout the project lifecycle. Every software module, database structure, user interface, and business workflow shall comply with these principles. 

## **6.2 Principle 1 — Business Before Technology** 

The software shall adapt to the factory's operational workflow. 

The factory shall not be required to modify its proven production processes simply to satisfy software limitations. 

Whenever a conflict exists between business operations and technical convenience, the business workflow shall take precedence. 

## **6.3 Principle 2 — Simplicity First** 

Operational simplicity has higher priority than feature quantity. 

The objective is to reduce operator effort, minimize training requirements, and lower the probability of human error. 

Every new feature shall answer the following question: 

###### **Does this make daily work easier for the operator?** 

If the answer is no, the feature should be reconsidered. 

## **6.4 Principle 3 — Scan Instead of Type** 

Manual typing shall be minimized. 

Primary operator interaction shall consist of: 

- QR Code Scanning 

- Barcode Scanning 

- Digital Weighing 

- Selecting predefined options 

- Confirming tasks 

Free-text input shall be limited to exceptional situations. 

## **6.5 Principle 4 — Configuration Over Customization** 

Business rules that are expected to change over time shall be configurable. 

Examples include: 

- Product grades 

- Product sizes 

- Package types 

- Processing steps 

- Weight tolerances 

- Zone definitions 

- Task priorities 

- Validation thresholds 

Changing these values shall not require software development or database redesign. 

## **6.6 Principle 5 — Complete Traceability** 

Every important operational event shall be traceable. 

The system shall preserve: 

- Supplier history 

- Batch genealogy 

- Weight history 

- Processing history 

- Packaging history 

- Shipment history 

- Operator history 

- Device history 

- Zone movement history 

Historical information shall never be lost. 

## **6.7 Principle 6 — No Physical Warehouse Complexity** 

The system shall not rely on shelves, aisles, or storage bins. 

Inventory shall be managed using operational Zones. 

Examples include: 

- Receiving 

- Cold Room 

- Sorting 

- Washing 

- Freeze Drying 

- Packaging 

- Shipping 

This reflects the physical reality of the factory and avoids unnecessary warehouse complexity. 

## **6.8 Principle 7 — Single Product per Receiving Container** 

A reusable **receiving** container (basket/crate) shall contain only one Product, Grade, Size, and active Batch. **After sorting** , export/shipping containers (nets, cartons) may contain multiple batches or grades simultaneously — this is the normal export packaging model, not an exception. 

## **6.9 Principle 8 — Controlled Product Mixing** 

The production process allows intentional mixing of batches. 

Examples include: 

- Completing a freeze-dryer load with material from multiple receiving batches. 

- Combining remaining fresh product with newer batches before export. 

- Completing partially filled packages during later production cycles. 

The system shall preserve parent-child batch relationships instead of preventing mixing. 

This approach maintains traceability without imposing impractical operational restrictions. 

## **6.10 Principle 9 — Weight is Dynamic** 

Product weight is not constant. 

The system shall assume that weight may change due to: 

- Natural moisture loss 

- Washing 

- Freezing 

- Freeze drying 

- Conventional drying 

- Packaging 

Each measurement represents the official weight at a specific production stage. 

Previous measurements shall never be overwritten. 

## **6.11 Principle 10 — Warning Before Blocking** 

Whenever possible, the system shall generate warnings instead of preventing operations. Examples include: 

- Unusual weight variation 

- Extended storage duration 

- Capacity limits 

- FIFO deviations 

Managers may review and approve exceptions when justified. 

Blocking operations shall be reserved only for situations that compromise product integrity, safety, or system consistency. 

## **6.12 Principle 11 — Session-Based Execution** 

Operational activities shall be executed within Sessions. 

A Session shall: 

- Save progress automatically 

- Support interruption recovery 

- Validate required information 

- Record operator actions 

- Generate permanent records only after successful completion 

This design improves reliability and prevents incomplete transactions. 

## **6.13 Principle 12 — Event-Driven History** 

The system shall record operational Events rather than modifying historical records. 

Examples include: 

- Batch Received 

- Batch Sorted 

- Weight Measured 

- Zone Changed 

- Package Created 

- Label Printed 

- Shipment Completed 

The operational timeline shall be reconstructed from recorded events. 

## **6.14 Principle 13 — Permanent Audit Trail** 

Operational history shall never be deleted. 

Instead of deleting records: 

- Status shall change. 

- Events shall be appended. 

- Historical data shall remain available. 

This principle supports: 

- Traceability 

- Auditing 

- Quality investigations 

- Customer complaints 

- Regulatory inspections 

## **6.15 Principle 14 — Exception-Based Management** 

Managers should not monitor routine operations. 

The management dashboard shall emphasize exceptions such as: 

- Delayed batches 

- Overdue tasks 

- Missing labels 

- Weight anomalies 

- Equipment issues 

- Capacity warnings 

- Pending approvals 

Routine work should proceed without managerial intervention. 

## **6.16 Principle 15 — Role-Based Access** 

Every operation shall require appropriate authorization. 

Permissions shall be determined by: 

- User Role 

- Operational Skill 

- Assigned Task 

Users shall only access the information and functions required for their responsibilities. 

## **6.17 Principle 16 — Mobile-First Operations** 

Operational activities shall be executable using Android industrial handheld devices. 

Typical mobile functions include: 

- QR scanning 

- Task execution 

- Batch movement 

- Quality confirmation 

- Zone transfer 

Printing and weighing shall be performed at fixed production terminals equipped with printers and digital scales. 

## **6.18 Principle 17 — Device Independence** 

The system shall not depend on a specific terminal. 

Any authorized terminal shall be capable of performing operational tasks according to its connected hardware. 

This ensures operational continuity if a device becomes unavailable. 

## **6.19 Principle 18 — Operational Transparency** 

Every operational decision shall be explainable. 

The system should allow managers to determine: 

- Why a batch was processed first. 

- Why a warning was generated. 

- Why a package contains multiple batches. 

- Why an operator override occurred. 

Operational decisions shall be supported by recorded data rather than assumptions. 

## **6.20 Principle 19 — Modular Architecture** 

Each software module shall have a single responsibility. 

Examples include: 

- Receiving 

- Inventory 

- Production 

- Packaging 

- Printing 

- Task Management 

- Configuration 

- Reporting 

Modules shall communicate through well-defined interfaces, allowing future expansion without redesigning the entire system. 

## **6.21 Principle 20 — Evolution Without Redesign** 

The architecture shall support future enhancements while preserving compatibility with Version 1. 

Examples of future expansion include: 

- ERP Integration 

- IoT Devices 

- AI Decision Support 

- Laboratory Management 

- Customer Portal 

- Multi-Warehouse Support 

New capabilities shall extend the system rather than replace existing structures. 

## **6.22 Guiding Statement** 

The design philosophy of this system can be summarized as follows: 

###### **Build software that follows the factory, protects operational data, simplifies daily work, and remains flexible enough to evolve without compromising stability.** 

This principle shall guide every architectural, functional, and technical decision throughout the project lifecycle. 

## **7. Core Concepts** 

#### **7.1 Purpose** 

This section defines the fundamental concepts used throughout the Warehouse and Production Management System. 

These concepts form the common language between business users, developers, quality managers, and system administrators. 

Every module, workflow, database entity, and API shall be based on the definitions described in this section. 

## **7.2 Product** 

A **Product** represents the commercial identity of an item handled by the factory. 

Examples include: 

- Fresh Truffle 

- Frozen Truffle 

- Freeze-Dried Truffle 

- Dried Truffle 

- Fresh Fruit 

- Frozen Fruit 

- Freeze-Dried Fruit 

_what_ the item is. A Product defines 

Operational characteristics such as grade, size, processing stage, or packaging are not part of the Product definition. 

A Product remains constant throughout its lifecycle. 

## **7.3 Product Configuration** 

Product characteristics that may change over time are managed through Product Configuration. 

Examples include: 

- Grade 

- Size 

- Variety 

- Quality Level 

These values are configurable by system administrators. 

Adding a new grade or size shall not require database modification or software development. 

## **7.4 Supplier** 

A Supplier is the person or organization delivering products to the factory. 

Each receiving operation is linked to exactly one supplier. 

Supplier settlement is based exclusively on: 

- Receiving Weight 

- Product 

- Grade 

- Size 

Subsequent production losses or gains do not affect supplier settlement. 

## **7.5 Batch** 

A Batch is the primary operational unit within the system. 

A Batch represents a specific quantity of one product with one grade and one size entering or moving through production. 

Every Batch has its own identity and lifecycle. 

A Batch may: 

- Move between Zones 

- Be weighed multiple times 

- Be divided 

- Be merged 

- Be processed 

- Be packaged 

● Be shipped 

The Batch is the foundation of traceability. 

## **7.6 Parent and Child Batch** 

Production operations may transform one Batch into one or more new Batches. 

Examples include: 

- Sorting 

- Splitting 

- Mixing 

- Packaging preparation 

The original Batch becomes the **Parent Batch** . 

The resulting Batch or Batches become **Child Batches** . 

The system shall permanently preserve these relationships to maintain production genealogy. 

Note: Grade-splitting may also occur as a natural side effect of other operations (e.g. Washing, Slicing) — not only during a dedicated Sorting step. 

## **7.7 Harvest Period** 

The business does not require exact harvest dates. 

Instead, products are associated with a Harvest Period. 

Examples include: 

- First Week of July 

- Second Week of July 

- Third Week of August 

Harvest Period provides sufficient traceability while simplifying production management. 

## **7.8 Container** 

A Container is a reusable physical object used to hold products during factory operations. 

Examples include: 

- Plastic Basket 

- Plastic Crate 

Each Container has a permanent QR Code. 

A Container may move between operational Zones. 

A Container may be reused after cleaning. 

At any given time, a Container may contain only one active Batch. 

## **7.9 Package** 

A Package is a logistics unit created during packaging. 

Unlike Containers, Packages are intended for shipment. 

Examples include: 

Consumer Packages 

- Metallized Pouch 

Shipping Packages 

- Export Carton 

- EPS Box 

- Pallet 

Packages may contain multiple Batches or multiple product grades. 

Packages are not reused. 

## **7.10 Zone** 

A Zone represents a functional production area. 

Examples include: 

- Receiving 

- Cold Room 

- Sorting 

- Washing 

- Slicing 

- Freezing 

- Freeze Drying 

- Conventional Drying 

- Packaging 

- Shipping 

- Quarantine 

- Waste 

The system tracks product movement between Zones instead of using warehouse shelves. 

A Batch or Container may belong to only one Zone at a time. 

## **7.11 Measurement** 

A Measurement is an official weight recorded during production. 

Measurements may occur at various stages, including: 

- Receiving 

- Sorting 

- Packaging 

Each Measurement is permanent. 

Historical values shall never be replaced. 

The latest Measurement represents the current official weight of the Batch. 

## **7.12 Session** 

A Session represents one continuous operational activity performed by an operator. Examples include: 

- Receiving Session 

- Sorting Session 

- Packaging Session 

Sessions provide: 

- Auto Save 

- Recovery after interruption 

- Validation 

- Audit History 

Permanent operational records are generated only after successful Session completion. 

## **7.13 Work Order** 

A Work Order defines a production objective. 

Examples include: 

- Wash Batch 

- Sort Batch 

- Freeze Product 

- Package Product 

- Prepare Shipment 

A Work Order may generate one or more Tasks. 

## **7.14 Task** 

A Task is the smallest executable operational activity assigned to an operator. 

Each Task has a lifecycle: 

- Created 

- Accepted 

- In Progress 

- Completed 

- Cancelled 

Only one operator may actively execute a Task at a time. 

## **7.15 Event** 

An Event represents a significant action recorded by the system. 

Examples include: 

- Batch Received 

- Weight Recorded 

- Zone Changed 

- Batch Mixed 

- Package Created 

- Label Printed 

- Shipment Released 

Events are immutable and form the system's audit trail. 

## **7.16 Timeline** 

A Timeline is the chronological history of a business object. 

Objects with Timelines include: 

- Batch 

- Container 

- Package 

- Work Order 

- Task 

Timelines enable users to understand: 

- What happened 

- When it happened 

- Who performed the action 

- Which device was used 

- Where the action occurred 

## **7.17 QR Code** 

Every operational object requiring physical identification shall have a QR Code. 

Examples include: 

- Containers 

- Packages 

- Cartons 

- EPS Boxes 

- Pallets 

Scanning a QR Code shall immediately display the current operational status and available actions for that object. 

QR Codes are operational identifiers rather than simple labels. 

## **7.18 Mobile Terminal** 

A Mobile Terminal is an Android industrial handheld device used by operators. 

Typical functions include: 

- QR Scanning 

- Task Execution 

- Batch Transfer 

- Production Confirmation 

- Quality Approval 

Mobile Terminals are optimized for movement throughout the factory. 

## **7.19 Fixed Production Terminal** 

A Fixed Production Terminal is a workstation equipped with: 

- Raspberry Pi 

- Digital Scale 

- Barcode Scanner 

- Label Printer 

These terminals perform operations requiring weighing or printing. 

Any terminal may be used by any operator after authentication. 

## **7.20 Warning** 

A Warning indicates an operational condition outside the normal range. 

Examples include: 

- Weight deviation 

- FIFO violation 

- Extended storage duration 

- Zone capacity threshold 

- Missing label 

Warnings do not automatically block operations. 

Managers may review and approve exceptions when appropriate. 

## **7.21 Exception** 

An Exception represents a situation requiring management attention. 

Examples include: 

- Critical equipment failure 

- Repeated print failures 

- Overdue production tasks 

- Missing quality approval 

- Quarantine requirement 

Exceptions appear on the Management Dashboard until resolved. 

## **7.22 Audit Trail** 

The Audit Trail is the permanent record of all significant business events. 

Audit records shall include: 

- Timestamp 

- User 

- Device 

- Event Type 

- Business Object 

- Previous State 

- New State 

Audit records shall never be modified or deleted. 

## **7.23 Configuration** 

Configuration defines all business parameters that may change over time. 

Examples include: 

- Product Grades 

- Product Sizes 

- Package Types 

- Process Definitions 

- Zone Definitions 

- Validation Rules 

- Weight Tolerances 

Configuration enables the business to evolve without software changes. 

## **7.24 Guiding Concept** 

The conceptual model of the system can be summarized as follows: 

**Products move through the factory as Batches, Batches are carried by Containers, processed through Tasks within Sessions, transformed by Operations, packaged into Packages, and every significant action is preserved as an immutable Event to provide complete operational traceability.** 

## **8. System Architecture Overview** 

#### **8.1 Purpose** 

This section describes the overall architecture of the Warehouse and Production Management System. 

The objective of the architecture is to provide a simple, reliable, and maintainable platform capable of supporting daily factory operations while remaining scalable for future expansion. 

The architecture follows a modular, service-oriented design with **one local Application Server and Database per site** (Iran, Dubai, Rome), plus a **read-only Cloud Aggregation layer** for cross-site reporting. No site depends on another site's server for local operations. 

## **8.2 High-Level Architecture** 

The system consists of five primary layers: 

+------------------------------------------------------+ 

|                  Client Applications                 | |------------------------------------------------------| 

- | Web Application | Raspberry Terminal | Android PDA   | 



<!-- Start of picture text -->
+-------------------------▲----------------------------+<br>│<br>                           HTTPS / REST API│<br>│<br>+-------------------------▼----------------------------+<br>|                Application Server                    |<br>|------------------------------------------------------|<br>| Authentication                                       |<br>| Receiving Module                                     |<br><!-- End of picture text -->

| Inventory Module                                     | | Production Module                                    | | Packaging Module                                     | | Task Engine                                          | | Print Engine                                         | | Reporting Module                                     | | Configuration Module                                 | +-------------------------▲----------------------------+ │ │ +-------------------------▼----------------------------+ |                  Database Server                     | |------------------------------------------------------| | Master Data                                          | | Operational Data                                     | | Audit Trail                                          | | Configuration                                        | 

+-------------------------▲----------------------------+ │ │ +-------------------------▼----------------------------+ |             Hardware & Peripheral Layer              | |------------------------------------------------------| | Barcode Scanner                                      | | QR Scanner                                           | | Digital Scale                                        | 

| Label Printer                                        | 

| Raspberry Pi                                         | 

| Android Industrial PDA                               | 

+------------------------------------------------------+ 

## **8.3 Architectural Goals** 

The architecture has been designed to satisfy the following objectives: 

- High operational reliability. 

- Minimal operator interaction. 

- Real-time production visibility. 

- Complete product traceability. 

- Modular software components. 

- Easy future expansion. 

- Low infrastructure complexity. 

- Fast deployment and maintenance. 

## **8.4 Client Applications** 

The system provides three client types. 

#### **8.4.1 Web Application** 

The Web Application is intended for supervisors, managers, quality personnel, and administrators. 

Main capabilities include: 

- Dashboard 

- Receiving Management 

- Inventory Monitoring 

- Batch Tracking 

- Work Order Management 

- Packaging Management 

- Reporting 

- User Management 

- Configuration 

- Audit History 

The web application is the primary management interface. 

#### **8.4.2 Fixed Production Terminal** 

The Fixed Production Terminal is built around a Raspberry Pi. 

Connected devices include: 

- Barcode Scanner 

- QR Scanner 

- Digital Scale 

- Label Printer 

Primary functions: 

- Product Receiving 

- Weight Recording 

- Label Printing 

- Label Reprinting 

- Package Confirmation 

- Batch Confirmation 

These terminals are installed at fixed production stations. 

#### **8.4.3 Mobile Industrial PDA** 

Android handheld terminals are used by production operators. 

Typical functions include: 

- Login 

- Select Operational Role 

- View "My Tasks" 

- Scan QR Codes 

- Execute Production Tasks 

- Confirm Operations 

- Move Containers 

- Perform Quality Checks 

No printing hardware is attached to mobile devices. 

Whenever a label is required, the operator completes the operation at the nearest Fixed Production Terminal. 

## **8.5 Application Server** 

The Application Server contains all business logic. 

Its responsibilities include: 

- Authentication 

- Authorization 

- Business Rules 

- Workflow Validation 

- Session Management 

- Task Assignment 

- Batch Genealogy 

- Packaging Logic 

- Traceability 

- Reporting 

- Configuration 

Clients do not communicate directly with the database. 

All operations pass through the Application Server. 

## **8.6 Functional Modules** 

The application is divided into independent modules. 

#### **Master Data** 

Maintains: 

- Products 

- Suppliers 

- Operators 

- Devices 

- Scales 

- Zones 

- Package Types 

- ● Configurations 

#### **Receiving Module** 

Responsible for: 

- Receiving Sessions 

- Supplier Selection 

- Product Identification 

- Weight Recording 

- Batch Creation 

- Container Assignment 

#### **Inventory Module** 

Responsible for: 

- Batch Tracking 

- Zone Management 

- Container Tracking 

- Current Weight 

- Current Status 

#### **Production Module** 

Supports: 

- Sorting 

- Washing 

- Slicing 

- Freezing 

- Freeze Drying 

- Conventional Drying 

Includes: 

- Session Management 

- Batch Transformation 

- Batch Mixing 

- Weight Validation 

#### **Packaging Module** 

Responsible for: 

- Consumer Packages 

- Shipping Cartons 

- EPS Boxes 

- Pallets 

- Package Hierarchy 

- Package Contents 

#### **Task Engine** 

Responsible for: 

- Work Orders 

- Task Assignment 

- Task Locking 

- Task Recovery 

- Task Prioritization 

- My Tasks 

#### **Print Engine** 

Responsible for: 

- Label Generation 

- Print Queue 

- Printer Selection 

- Reprint 

- Print History 

Printing failures shall not interrupt production unless explicitly required by business rules. 

#### **Reporting Module** 

Provides: 

- Operational Reports 

- Production Reports 

- Inventory Reports 

- Exception Dashboard 

- Traceability Reports 

#### **Configuration Module** 

Allows administrators to manage: 

- Product Grades 

- Product Sizes 

- Package Types 

- Zones 

- Processes 

- Validation Rules 

- Weight Tolerances 

- System Parameters 

No software modification is required for configuration changes. 

## **8.7 Database Layer** 

The database stores all persistent business information. 

Major categories include: 

Master Data 

- Products 

- Suppliers 

- Operators 

- Devices 

- Configurations 

Operational Data 

- Batches 

- Measurements 

- Containers 

- Packages 

- Work Orders 

- Tasks 

Historical Data 

- Events 

- Audit Trail 

- Timeline 

- Print History 

Configuration Data 

- Product Configuration 

- Process Configuration 

- Zone Configuration 

- System Settings 

Historical records are append-only wherever practical. 

Deletion of operational records is not permitted. 

## **8.8 Hardware Architecture** 

The software communicates with production hardware through standard device interfaces. 

Supported equipment includes: 

- QR Code Scanner 

- Barcode Scanner 

- Digital Scale 

- Label Printer 

- Raspberry Pi Terminal 

- Android PDA 

The application remains independent of specific hardware vendors wherever possible. 

## **8.9 Communication Architecture** 

All clients communicate with the Application Server over HTTPS. 

No client communicates directly with the database. 

Typical communication flow: 

Operator 

↓ 

Android PDA 

↓ 

REST API 

↓ 

Application Server 

↓ 

Database 

The same architecture applies to the Web Application and Raspberry Pi terminals. 

## **8.10 Security Architecture** 

Authentication is required for all users. 

Authorization is controlled through: 

- Role 

- Skill 

- Assigned Task 

Every significant action is associated with: 

- User 

- Device 

- Timestamp 

- Session 

Complete operational accountability is maintained. 

## **8.11 Failure Recovery** 

The system is designed to tolerate operational interruptions. 

Examples include: 

- Power failure 

- Network interruption 

- PDA battery depletion 

- Printer malfunction 

Sessions preserve progress. 

Tasks remain recoverable. 

Print jobs remain queued until successfully completed or cancelled. 

No completed business transaction shall be lost due to temporary hardware failure. 

## **8.12 Scalability** 

The architecture supports future expansion without redesign. 

Potential future additions include: 

- ERP Integration 

- Accounting Integration 

- IoT Devices 

- Machine Monitoring 

- AI Decision Support 

- Laboratory Management 

- Multi-Warehouse Operations 

These capabilities can be added as independent modules while preserving the core architecture. 

## **8.13 Architectural Principles** 

The architecture follows the following guiding principles: 

- Modular design. 

- Centralized business logic. 

- Single source of truth. 

- Configuration over customization. 

- Session-based execution. 

- Event-driven audit trail. 

- Complete traceability. 

- Mobile-first production workflow. 

- Simple operator experience. 

- High operational reliability. 

## **8.14 Architecture Summary** 

The Warehouse and Production Management System is designed as a centralized operational platform where all production activities, inventory movements, packaging operations, and traceability records are managed through a unified application server. 

By separating client devices, business logic, and persistent data while maintaining a configurable and modular structure, the system provides a stable foundation for daily factory operations and future business growth. 

## **9. Physical Infrastructure** 

#### **9.1 Purpose** 

This section defines the physical infrastructure required to operate the Warehouse and Production Management System. 

The objective is to provide a simple, reliable, and cost-effective hardware environment that supports daily factory operations while minimizing maintenance and training requirements. 

The infrastructure has been designed around the actual workflow of the factory rather than a traditional warehouse. 

## **9.2 Infrastructure Overview** 

The production environment consists of four major infrastructure components: 

+------------------------------------------------------+ 

|                  Factory Network                     | 

+------------------------------------------------------+ 



<!-- Start of picture text -->
▲ ▲<br>│ │<br>│ │<br>+-------+------+      +-------+------+<br><!-- End of picture text -->



<!-- Start of picture text -->
| Fixed Terminal|      | Mobile PDA   |<br><!-- End of picture text -->



<!-- Start of picture text -->
| Raspberry Pi  |      | Android      |<br>+-------+------+      +-------+------+<br>│ │<br>└────────────┬────────┘<br>│<br><!-- End of picture text -->

HTTPS / Wi-Fi 

│ 

+-------▼--------+ 

| Application    | 

| Server         | 

+-------▲--------+ 

│ 

+-------▼--------+ 

| Database       | 

+----------------+ 

## **9.3 Factory Network** 

All production devices shall operate on a single secure local network. 

The network shall provide: 

- Stable Wi-Fi coverage across all production areas. 

- Wired Ethernet where practical. 

- Internet access for remote administration (optional). 

- Secure communication using HTTPS. 

Recommended network availability: 

###### **99% or higher during production hours.** 

## **9.4 Application Server** 

Version 1 shall deploy one local Application Server per site (three total: Iran, Dubai, Rome), plus a Cloud Aggregation service. 

Responsibilities include: 

- Business Logic 

- Authentication 

- API Services 

- Task Management 

- Print Management 

- Configuration 

- Reporting 

Recommended minimum specifications: 

###### **Component Recommended** 

CPU 4 Core Memory 16 GB RAM Storage 500 GB SSD Operating Linux Server (Ubuntu LTS System recommended) 

Database PostgreSQL 

The server may be deployed: 

● On-premises 

● Virtual Machine 

- Cloud VPS (optional) 

## **9.5 Database Server** 

Version 1 shall deploy one local database per site (Iran, Dubai, Rome), storing that site's own operational data. The Cloud Aggregation service maintains a read-only replica synchronized from each site for cross-site reporting; it never receives direct writes. 

The database stores: Master Data, Operational Data, Configuration, Audit Trail, Event History. 

Daily automated backups shall be configured per site. Backup retention policy should be configurable. 

## **9.6 Fixed Production Terminal** 

Each production station requiring weighing or printing shall include one Fixed Production Terminal. 

Hardware components: 

- Raspberry Pi 

- Touch Screen Monitor 

- QR / Barcode Scanner 

- Digital Scale 

- Label Printer 

- Network Connection 

Typical installation locations: 

- Receiving Area 

- Packaging Area 

- Shipping Area 

## **9.7 Raspberry Pi** 

The Raspberry Pi acts as an industrial workstation. 

Functions include: 

- User Login 

- Session Execution 

- Weight Capture 

- Label Printing 

- Batch Confirmation 

The Raspberry Pi stores no permanent business data. 

All information is retrieved from the central server. 

## **9.8 Barcode / QR Scanner** 

Scanners shall support: 

- 1D Barcodes 

- QR Codes 

Scanning is the primary operator input method. 

Supported objects include: 

- Containers 

- Packages 

- Cartons 

- EPS Boxes 

- Pallets 

- Work Orders (optional) 

Manual typing should be minimized. 

## **9.9 Digital Scale** 

Each weighing station shall contain one calibrated digital scale. 

Requirements: 

- Stable communication with Raspberry Pi 

- Automatic weight acquisition 

- Manual confirmation before saving 

- Configurable calibration schedule 

All measurements shall be recorded in the database. 

Previous measurements shall never be overwritten. 

## **9.10 Label Printer** 

Industrial thermal printers shall be used. 

Responsibilities include: 

- Product Labels 

- Package Labels 

- Carton Labels 

- EPS Labels 

- Pallet Labels 

The Print Engine manages all printing requests. 

If printing fails: 

- Print Job remains pending. 

- Operator may retry printing. 

- Management can review print history. 

## **9.11 Mobile Industrial PDA** 

Production operators use Android industrial handheld terminals. 

Capabilities include: 

- QR Scanning 

- Task Execution 

- Batch Movement 

- Zone Transfer 

- Quality Confirmation 

- Work Order Execution 

No printer is attached. 

The PDA is intended for mobility and operational efficiency. 

## **9.12 Production Areas** 

Typical production areas include: 

- Receiving 

- Cold Room 

- Sorting 

- Washing 

- Slicing 

- Freezing 

- Freeze Drying 

- Conventional Drying 

- Packaging 

- Shipping 

- Quarantine 

- Waste 

Each area requires reliable Wi-Fi coverage. 

## **9.13 Containers** 

Reusable containers include: 

- Plastic Baskets 

- Plastic Crates 

Characteristics: 

- Permanent QR Code 

- Reusable 

- Individually identifiable 

- Cleaning history 

- Movement history 

Containers are operational assets. 

They are not disposable packaging. 

## **9.14 Shipping Materials** 

Shipping materials include: 

- Metallized Pouches 

- Export Cartons 

- EPS Boxes 

- Pallets 

Shipping packages receive printed labels generated by the system. 

Package hierarchy shall be maintained digitally. 

## **9.15 Power Infrastructure** 

Critical infrastructure should include: 

- UPS for Application Server 

- UPS for Database Server 

- UPS for Network Equipment 

Short power interruptions should not interrupt production. 

Sessions shall automatically recover after restart. 

## **9.16 Backup Infrastructure** 

Automatic backups shall include: 

- Database 

- Configuration 

- Uploaded Documents (if applicable) 

Recommended policy: 

- Daily Full Backup 

- Hourly Incremental Backup (optional) 

- Off-site Backup (recommended) 

## **9.17 Device Identification** 

Every hardware device shall have a unique identifier. 

Examples: 

- Raspberry Terminal RT-01 

- Raspberry Terminal RT-02 

- PDA-01 

- PDA-02 

- Scale-01 

- Printer-01 

Operational events shall record the originating device. 

## **9.18 Infrastructure Monitoring** 

The system shall monitor: 

- Device Online Status 

- Printer Availability 

- Scale Connectivity 

- PDA Connectivity 

- Last Heartbeat 

- Print Queue Status 

Managers shall be notified of hardware failures through the Exception Dashboard. 

## **9.19 Scalability** 

The infrastructure shall support future expansion without redesign. 

Additional equipment can be introduced simply by registering: 

- New Raspberry Terminals 

- New Mobile PDAs 

- New Printers 

- New Scales 

No database modification shall be required. 

## **9.20 Infrastructure Philosophy** 

The physical infrastructure has been intentionally designed around two complementary terminal types: 

###### **Fixed Production Terminals** 

Provide weighing, printing, and high-accuracy operations. 

###### **Mobile Industrial PDAs** 

Provide mobility, QR-based workflows, and production task execution. 

This combination minimizes hardware cost, simplifies operator workflows, and allows production to continue even if one terminal becomes temporarily unavailable. 

The system architecture therefore remains flexible, reliable, and aligned with the real operational needs of the factory. 

### **9.21 Iran Connectivity Resilience** 

Because international internet connectivity in Iran may be interrupted unpredictably, the Iran site's local Application Server shall queue all operational events (scans, weight records, corrections) in a local Outbox Queue. Production continues fully offline. Once connectivity is restored, queued events are transmitted to the Cloud Aggregation service in their original chronological order. Dubai and Rome do not face this constraint and may sync in near real-time. 

## **10. Software Modules** 

#### **10.1 Purpose** 

The Warehouse and Production Management System is organized into independent software modules. 

Each module is responsible for a specific business domain and communicates with other modules through well-defined business services. 

This modular architecture simplifies development, testing, maintenance, and future expansion while ensuring that each module has a single responsibility. 

## **10.2 Module Architecture** 

The software is divided into the following modules: 

Authentication 

│ 

- ├── Dashboard 

- ├── Master Data 

- ├── Receiving 

- ├── Inventory 

- ├── Production 

- ├── Packaging 

- ├── Shipping 

- ├── Task Management 

- ├── Print Management 

- ├── Quality Control 

- ├── Reporting 

- ├── Configuration 

- └── Audit & Traceability 

Each module can evolve independently while sharing the same database and business rules. 

## **10.3 Authentication Module** 

###### **Purpose** 

Manages user authentication and system security. 

###### **Responsibilities** 

- User Login 

- Logout 

- Session Management 

- Password Management 

- Device Authentication 

- Token Management 

- User Activity Logging 

###### **Main Users** 

- All Users 

## **10.4 Dashboard Module** 

###### **Purpose** 

Provides real-time operational visibility. 

###### **Features** 

- My Tasks 

- Production Status 

- Inventory Overview 

- Active Work Orders 

- Equipment Status 

- Exception Dashboard 

- Pending Approvals 

- Weight Warnings 

- Zone Capacity 

###### **Main Users** 

- Managers 

- Supervisors 

- Operators (limited view) 

## **10.5 Master Data Module** 

###### **Purpose** 

Maintains all reference information used by the system. 

###### **Managed Data** 

- Products 

- Product Grades 

- Product Sizes 

- Suppliers 

- Package Types 

- Zones 

- Devices 

- Scales 

- Operators 

- Roles 

- Skills 

Master data changes affect all operational modules. 

## **10.6 Receiving Module** 

###### **Purpose** 

Records all incoming products. 

###### **Responsibilities** 

- Receiving Session 

- Supplier Selection 

- Product Selection 

- Grade Selection 

- Size Selection 

- Container Assignment 

- Digital Weighing 

- Batch Creation 

- QR Assignment 

- Initial Traceability 

###### **Hardware Integration** 

- Raspberry Pi 

- Scale 

- Barcode Scanner 

- Label Printer (when required) 

## **10.7 Inventory Module** 

###### **Purpose** 

Maintains the real-time operational status of all inventory. 

###### **Responsibilities** 

- Batch Tracking 

- Container Tracking 

- Zone Management 

- Weight History 

- Status Management 

- Inventory Search 

- Current Location 

- Current Quantity 

###### **Features** 

- FIFO Support 

- Container History 

- Movement History 

- Batch Timeline 

## **10.8 Production Module** 

###### **Purpose** 

Controls all production operations. 

###### **Supported Operations** 

- Sorting 

- Washing 

- Slicing 

- Freezing 

- Freeze Drying 

- Conventional Drying 

###### **Responsibilities** 

- Batch Transformation 

- Batch Split 

- Batch Merge 

- Batch Mixing 

- Production Sessions 

- Production History 

The Production Module forms the operational core of the system. 

## **10.9 Packaging Module** 

###### **Purpose** 

Manages all packaging activities. 

###### **Responsibilities** 

- Consumer Package Creation 

- Carton Assembly 

- EPS Assembly 

- Pallet Assembly 

- Package Hierarchy 

- Package Content 

- Repacking 

###### **Features** 

- Mixed Product Packages 

- Mixed Grade Packages 

- QR Labels 

- Package Traceability 

## **10.10 Shipping Module** 

###### **Purpose** 

Prepares products for shipment. 

###### **Responsibilities** 

- Shipment Assembly 

- Carton Completion 

- EPS Completion 

- Pallet Preparation 

- Shipment Validation 

- Shipment Release 

Version 1 ends when shipment packages are ready for dispatch. 

Transportation management is outside the project scope. 

## **10.11 Task Management Module** 

###### **Purpose** 

Coordinates operational work inside the factory. 

###### **Responsibilities** 

- Work Orders 

- Task Assignment 

- Task Locking 

- Task Recovery 

- Task Priorities 

- My Tasks 

- Recommended Tasks 

###### **Assignment Modes** 

- Automatic 

- Manual 

- Self Assignment 

Managers may override task priorities whenever necessary. 

## **10.12 Print Management Module** 

###### **Purpose** 

Provides centralized printing services. 

###### **Responsibilities** 

- Label Generation 

- Print Queue 

- Printer Selection 

- Reprint 

- Print History 

- Failed Print Recovery 

###### **Features** 

- Pending Print Queue 

- Retry Mechanism 

- Print Audit Trail 

The Print Engine is independent of production operations. 

## **10.13 Quality Control Module** 

###### **Purpose** 

Supports operational quality inspections. 

###### **Responsibilities** 

- QC Approval 

- QC Rejection 

- Inspection Checklist 

- Operator Confirmation 

- Quality Remarks 

###### **Features** 

- Configurable Checklists 

- Digital Approval 

- Digital Signature 

- Rework Requests 

Version 1 focuses on operational quality control rather than laboratory testing. 

## **10.14 Reporting Module** 

###### **Purpose** 

Provides operational reporting. 

###### **Standard Reports** 

- Inventory Report 

- Batch Report 

- Production Report 

- Receiving Report 

- Packaging Report 

- Shipment Report 

- Weight History 

- Operator Activity 

- Equipment Usage 

- Traceability Report 

###### **Dashboards** 

- Management Dashboard 

- Operator Dashboard 

- Exception Dashboard 

## **10.15 Configuration Module** 

###### **Purpose** 

Allows administrators to configure business rules without software modification. 

###### **Configuration Areas** 

- Product Grades 

- Product Sizes 

- Package Types 

- Zones 

- Process Definitions 

- Validation Rules 

- Weight Tolerances 

- Task Priorities 

- System Parameters 

Configuration changes become effective immediately after activation. 

## **10.16 Audit & Traceability Module** 

###### **Purpose** 

Maintains complete operational history. 

###### **Responsibilities** 

- Event History 

- Audit Trail 

- Timeline Generation 

- Batch Genealogy 

- Container History 

- Package History 

- Operator Activity 

- Device Activity 

Historical information shall never be deleted. 

## **10.17 Notification Module** 

###### **Purpose** 

Provides operational notifications and alerts. 

###### **Notifications** 

- New Task Assigned 

- Printer Offline 

- Scale Disconnected 

- Weight Warning 

- Capacity Warning 

- Overdue Task 

- Pending Label 

- Equipment Failure 

Notifications support proactive operational management. 

## **10.18 Device Management Module** 

###### **Purpose** 

Manages all hardware connected to the system. 

###### **Managed Devices** 

- Raspberry Pi Terminals 

- Android PDAs 

- Barcode Scanners 

- QR Scanners 

- Digital Scales 

- Label Printers 

###### **Responsibilities** 

- Device Registration 

- Online Status 

- Heartbeat Monitoring 

- Device Assignment 

- Device Audit History 

## **10.19 Module Dependencies** 

The following diagram illustrates the primary dependencies between modules: 

Authentication 

- │ 

▼ 

Master Data │ ▼ Receiving │ ▼ Inventory │ ▼ Production │ ▼ Packaging │ ▼ Shipping 

Supporting Modules 

Task Management Print Management Quality Control Reporting Configuration Audit & Traceability 

Notification 

Device Management 

Supporting modules operate across the entire system and are available to multiple functional modules. 

## **10.20 Design Philosophy** 

Each module has a clearly defined responsibility and communicates with the rest of the system through standardized business services. 

This modular architecture ensures: 

- Low coupling between modules. 

- High maintainability. 

- Easier testing. 

- Simplified future development. 

- Independent feature expansion. 

- Better system stability. 

The result is a scalable and production-oriented software platform capable of supporting both current operational requirements and future business growth without fundamental architectural changes. 

## **11. User Roles** 

#### **11.1 Purpose** 

This section defines the user roles within the Warehouse and Production Management System. 

Each role represents a business responsibility rather than a job title. A single employee may hold multiple roles, and permissions are granted based on assigned roles and skills. 

All users must authenticate before accessing the system. 

## **11.2 Role-Based Access Control (RBAC)** 

The system uses **Role-Based Access Control (RBAC)** . 

Permissions are determined by: 

- Assigned Role 

- Assigned Skills (optional) 

- Assigned Tasks 

- System Configuration 

Managers may assign or revoke roles without modifying the software. 

## **11.3 System Administrator** 

###### **Purpose** 

Responsible for system administration and configuration. 

###### **Responsibilities** 

- User Management 

- Role Management 

- System Configuration 

- Product Configuration 

- Device Registration 

- Printer Configuration 

- Scale Configuration 

- Zone Configuration 

- Backup Configuration 

- Audit Review 

###### **Permissions** 

- Full system access 

## **11.4 Factory Manager** 

###### **Purpose** 

Responsible for overall factory operations. 

###### **Responsibilities** 

- Production Monitoring 

- Inventory Monitoring 

- Task Prioritization 

- Exception Approval 

- Work Order Creation 

- Shipment Approval 

- KPI Monitoring 

###### **Permissions** 

- Full operational access 

- Cannot modify core system settings 

## **11.5 Warehouse Supervisor** 

###### **Purpose** 

Manages warehouse activities and inventory movement. 

###### **Responsibilities** 

- Receiving Supervision 

- Zone Management 

- Container Tracking 

- Inventory Verification 

- Shipment Preparation 

- Stock Investigation 

###### **Permissions** 

- Receiving 

- Inventory 

- Packaging 

- Shipping 

- Reporting 

## **11.6 Receiving Operator** 

###### **Purpose** 

Handles incoming products. 

###### **Responsibilities** 

- Supplier Verification 

- Product Registration 

- Digital Weighing 

- Container Assignment 

- Batch Creation 

- ● QR Confirmation 

###### **Hardware** 

- Raspberry Pi 

- Digital Scale 

- Barcode Scanner 

- Label Printer (if applicable) 

## **11.7 Sorting Operator** 

###### **Purpose** 

Performs grading and size classification. 

###### **Responsibilities** 

- Receive Sorting Task 

- Scan Container 

- Sort Product 

- Split Batch 

- Create Child Batches 

- Confirm Completion 

###### **Mobile Functions** 

- Scan Basket 

- View Task 

- Complete Sorting 

## **11.8 Washing Operator** 

###### **Purpose** 

Performs washing operations. 

###### **Responsibilities** 

- View Washing Tasks 

- Scan Container 

- Start Washing 

- Complete Washing 

- Return Container 

The system may recommend washing order based on FIFO or manager-defined priorities. 

## **11.9 Slicing Operator** 

###### **Purpose** 

Prepares products for processing. 

###### **Responsibilities** 

- Scan Container 

- Slice Product 

- Confirm Completion 

- Transfer to Next Zone 

## **11.10 Freezing Operator** 

###### **Purpose** 

Operates the freezing process. 

###### **Responsibilities** 

- Scan Batch 

- Load Freezer 

- Confirm Processing 

- Unload Product 

- Move to Next Zone 

## **11.11 Freeze Drying Operator** 

###### **Purpose** 

Operates the freeze dryer. 

###### **Responsibilities** 

- View Processing Tasks 

- Scan Batches 

- Build Processing Load 

- Confirm Machine Loading 

- Confirm Completion 

- Transfer Product 

The system supports combining multiple batches to complete a production cycle while preserving genealogy. 

## **11.12 Conventional Drying Operator** 

###### **Purpose** 

Operates conventional drying equipment. 

###### **Responsibilities** 

- Load Dryer 

- Scan Batch 

- Confirm Drying 

- Complete Session 

- Transfer Product 

## **11.13 Packaging Operator** 

###### **Purpose** 

Packages finished products. 

###### **Responsibilities** 

- Scan Product Packages 

- Build Cartons 

- Build EPS Boxes 

- Confirm Package Contents 

- Request Label Printing 

Operators scan each package before completing the carton. The carton label is printed only after all contents have been confirmed. 

## **11.14 Shipping Operator** 

###### **Purpose** 

Prepares shipments for dispatch. 

###### **Responsibilities** 

- Build Shipments 

- Scan Cartons 

- Scan EPS Boxes 

- Build Pallets 

- Confirm Shipment 

- Transfer to Shipping Zone 

## **11.15 Quality Control (QC) Inspector** 

###### **Purpose** 

Performs operational quality inspections. 

###### **Responsibilities** 

- Inspect Product 

- Approve Processing 

- Reject Product 

- Create Rework Requests 

- Record Inspection Notes 

Version 1 focuses on operational QC rather than laboratory analysis. 

## **11.16 Maintenance Technician** 

###### **Purpose** 

Maintains production equipment. 

###### **Responsibilities** 

- Printer Maintenance 

- Scale Calibration 

- Device Diagnostics 

- Hardware Replacement 

- Equipment Verification 

No access to operational inventory changes. 

## **11.17 Auditor** 

###### **Purpose** 

Reviews operational history. 

###### **Responsibilities** 

- Audit Trail Review 

- Batch Traceability 

- Event History 

- User Activity Review 

- Print History 

Auditors have read-only access. 

## **11.18 Dashboard Access Matrix** 

**Module Admin Manage Superviso Operato QC Audito r r r r** Dashboard ✓ ✓ ✓ ✓ ✓ ✓ Receiving ✓ ✓ ✓ ✓ Rea Read d Inventory ✓ ✓ ✓ Read Rea Read d Production ✓ ✓ ✓ ✓ ✓ Read Packaging ✓ ✓ ✓ ✓ Rea Read d Shipping ✓ ✓ ✓ ✓ Rea Read d ✓ Read — — — — Configuratio n 

Reporting ✓ ✓ ✓ Limited ✓ ✓ Audit Trail ✓ ✓ Read — Rea ✓ d 

## **11.19 Role Selection on Terminals** 

Every terminal, whether a **Fixed Raspberry Pi Terminal** or a **Mobile Android PDA** , shall display a role selection screen after user login. 

This design allows any terminal to be used for different operational activities if another device becomes unavailable. 

Example workflow: 

1. User logs in. 

2. System displays the roles assigned to that user. 

3. User selects the desired operational role. 

4. The interface changes to the workflow for that role. 

For example, the same device may be used during the day as: 

- Receiving Terminal 

- Sorting Terminal 

- Packaging Terminal 

- Shipping Terminal 

depending on the logged-in user's selected role. 

## **11.20 My Tasks** 

Operational roles shall have access to a **My Tasks** screen. 

This screen displays: 

- Assigned Tasks 

- Recommended Tasks 

- Task Priority 

- Current Status 

- Target Zone 

- Due Time 

Operators may also scan a QR code directly. If the scanned object corresponds to a valid task for their role, the system shall open the appropriate workflow automatically. 

This dual approach supports both **task-driven** and **scan-driven** operations. 

## **11.21 Permission Principles** 

The permission model follows these principles: 

- Users only see functions relevant to their assigned role. 

- Operators cannot modify master data. 

- Configuration changes are restricted to administrators. 

- Operational actions are recorded with user identity and device information. 

- Every critical action is logged in the audit trail. 

- Multiple roles may be assigned to a single user. 

- Permissions can be expanded through configuration without modifying the software. 

## **11.22 Role Philosophy** 

User roles are designed around **factory operations** , not organizational hierarchy. 

The system separates **who the user is** from **what the user is doing** at a specific moment. 

This approach provides maximum operational flexibility while maintaining security, traceability, and accountability across all production activities. 

## **12. High-Level Business Flow** 

#### **12.1 Purpose** 

This section describes the overall business flow of the Warehouse and Production Management System. 

It provides a high-level view of how products move through the factory from receiving to shipment. 

The purpose is to establish a common understanding of the operational lifecycle before defining detailed business scenarios. 

## **12.2 Business Flow Overview** 

Every product entering the factory follows the same high-level lifecycle. 

Supplier 

│ 

▼ 

Receiving 

│ 

▼ 

Cold Storage 

│ 

▼ 

Sorting 

│ 

├───────────────┐ 

▼ ▼ 

Fresh Shipment   Processing 

│ ┌──────────────┼───────────────┐ ▼ ▼ ▼ Freezing    Freeze Drying    Conventional Drying │ │ │ └──────────────┴───────────────┘ │ ▼ Packaging │ ▼ Shipment Preparation │ ▼ Ready for Export 

This workflow represents the standard operational path. Some products may skip specific stages depending on business requirements. 

## **12.3 Receiving** 

The business flow begins when products arrive from suppliers. 

Typical activities include: 

- Supplier identification 

- Product verification 

- Grade confirmation 

- Size confirmation 

- Weight measurement 

- Receiving Batch creation 

- Basket assignment 

- QR association 

Each receiving basket contains: 

- One Product 

- One Grade 

- One Size 

Receiving weight is the official weight used for supplier settlement. 

## **12.4 Cold Storage** 

After receiving, products are transferred to the Cold Room. 

Products may remain in cold storage for: 

- A few hours 

- Several days 

The system tracks: 

- Entry Time 

- Current Zone 

- Storage Duration 

The system may recommend processing older products first (FIFO), but managers may override the recommendation. 

## **12.5 Sorting** 

Products are sorted according to operational requirements. 

Sorting may include: 

- Size classification 

- Quality grading 

- Production routing 

A receiving batch may become multiple child batches. 

Conversely, child batches originating from different receiving batches may later be intentionally mixed during production. 

The system preserves batch genealogy throughout these transformations. 

## **12.6 Production Decision** 

After sorting, each batch is assigned to one of two main paths: 

###### **Fresh Export** 

or 

###### **Processing** 

The decision is based on: 

- Product quality 

- Customer demand 

- Production planning 

- Management decision 

## **12.7 Fresh Export Flow** 

Products intended for export remain fresh. 

Typical workflow: 

Sorted Basket 

- │ 

- 

Net Packaging 

- │ 

- 

EPS Box Assembly 

- │ 

- 

###### Shipment Preparation 

Important characteristics: 

- Nets do not receive individual labels. 

- An EPS Box may contain nets from different grades or sizes. 

- Leftover quantities may be combined with later batches before net packaging. 

- Parent-child relationships are preserved digitally. 

## **12.8 Processing Flow** 

Products selected for processing are routed according to business requirements. 

Possible processing routes include: 

Sorted Batch 

│ ├────────► Freezing │ ├────────► Freeze Drying │ └────────► Conventional Drying 

Not every product follows every process. 

The routing depends on product type and production planning. 

## **12.9 Freeze-Drying Flow** 

A typical freeze-drying workflow is: 

Sorting 

│ ▼ 

Washing 

│ 

▼ Slicing │ ▼ Freezing │ ▼ Freeze Dryer │ ▼ Packaging 

Multiple production batches may be combined to fully utilize the freeze dryer. The system records all parent batches for complete traceability. 

## **12.10 Conventional Drying Flow** 

Products assigned to conventional drying follow: 

Sorting 

│ 

▼ 

Washing 

│ 

▼ 

Drying 

│ 

▼ 

Packaging 

The exact processing parameters are defined in the Configuration Module. 

## **12.11 Packaging** 

Packaging transforms processed products into saleable units. 

Examples include: 

Consumer Package 

- Metallized Pouch 

Shipping Package 

- Export Carton 

- EPS Box 

- Pallet 

Packaging supports: 

- Multiple products per carton 

- Multiple grades per carton 

- Multiple batches per carton 

All package contents are recorded digitally. 

## **12.12 Label Printing** 

Labels are printed after package contents have been confirmed. 

Typical workflow: 

1. Operator scans every pouch placed into the carton. 

2. System validates carton contents. 

3. Carton is completed. 

4. Carton label is generated. 

5. Label is printed at the fixed terminal. 

6. Operator attaches the printed label. 

If printing fails: 

- The carton remains in a **Pending Label** status. 

- The system stores the package in the Print Queue. 

- The label can be reprinted later without rebuilding the carton. 

## **12.13 Shipment Preparation** 

Shipment preparation includes: 

- Carton Assembly 

- EPS Assembly 

- Pallet Assembly 

- Shipment Validation 

After validation, packages move to the Shipping Zone. 

Version 1 ends when shipments are ready for dispatch. 

Transportation is outside the project scope. 

## **12.14 Batch Mixing** 

Intentional batch mixing is supported in two situations: 

###### **Fresh Export** 

Remaining quantities from older and newer receiving batches may be combined before net packaging. 

###### **Production** 

Multiple receiving batches may be combined to create a full freeze-drying or drying cycle. 

The system maintains digital genealogy for all contributing parent batches. 

Exact harvest dates are not required; the Harvest Period (e.g., "First Week of July") provides sufficient traceability. 

## **12.15 Weight Lifecycle** 

Weight changes throughout production are expected. 

Typical measurements occur at: 

- Receiving 

- After Sorting 

- Packaging 

The system does not require weighing after every process step. 

Weight differences may result from: 

- Moisture loss 

- Washing 

- Freezing 

- Freeze Drying 

- Conventional Drying 

If weight variation exceeds configured thresholds, the system generates a **warning** for managerial review rather than blocking the operation. 

## **12.16 Task Execution** 

Operators perform work in one of two ways: 

###### **Task-Driven** 

The operator opens **My Tasks** , selects an assigned task, and follows the guided workflow. 

###### **Scan-Driven** 

The operator scans a basket or package. If a valid operation is available for the current role, the system opens the appropriate workflow automatically. 

Both methods produce identical business results. 

## **12.17 End-to-End Traceability** 

Throughout the business flow, the system continuously records: 

- Supplier 

- Harvest Period 

- Batch Genealogy 

- Weight History 

- Zone Movements 

- Production Operations 

- Packaging History 

- Shipment History 

- Operators 

- Devices 

- Audit Events 

This creates a complete digital history from receiving to shipment. 

## **12.18 High-Level Flow Summary** 

The Warehouse and Production Management System follows a simple operational principle: 

1. Receive products from suppliers. 2. Store products in operational zones. 3. Sort and classify products. 4. Decide between fresh export or processing. 5. Execute production operations as required. 6. Package finished products. 

7. Prepare shipments. 8. Preserve complete traceability throughout the entire lifecycle. 

This business flow reflects the real operational practices of the factory while providing a consistent digital framework for inventory control, production management, and export preparation. 

## **13. Traceability Concept** 

#### **13.1 Purpose** 

Traceability is one of the fundamental capabilities of the Warehouse and Production Management System. 

Its purpose is to provide complete visibility into the lifecycle of every product handled by the factory, from supplier receiving to final shipment. 

Unlike traditional warehouse systems, this factory intentionally allows batch splitting, batch merging, and product mixing during production. Therefore, the traceability model is based on **batch genealogy** rather than a simple one-to-one tracking approach. 

The system is designed to preserve business reality while maintaining the highest practical level of traceability. 

## **13.2 Traceability Objectives** 

The system shall enable users to answer questions such as: 

- Which supplier delivered this product? 

- When was it received? 

- Which harvest period does it belong to? 

- Which baskets contained it? 

- Which production processes did it pass through? 

- Which operators handled it? 

- Which devices were used? 

- Which batches were mixed together? 

- Which packages contain this product? 

- Which shipment included this package? 

All answers shall be available through the system without manual investigation. 

## **13.3 Traceability Levels** 

The system provides traceability across multiple levels. 

###### **Level 1 — Supplier Traceability** 

Tracks: 

- Supplier 

- Receiving Date 

- Receiving Weight 

- Product 

- Grade 

- Size 

Supplier settlement is always based on the original receiving record. 

###### **Level 2 — Receiving Batch Traceability** 

Each receiving operation creates a unique Receiving Batch. 

The Receiving Batch records: 

- Product 

- Grade 

- Size 

- Harvest Period 

- Supplier 

- Receiving Session 

- Receiving Weight 

Each Receiving Batch is assigned to one basket. 

###### **Level 3 — Container Traceability** 

Reusable baskets are individually tracked. 

The system records: 

- Current Batch 

- Current Zone 

- Cleaning History 

- Movement History 

- Operator History 

A basket may carry many different batches over its lifetime, but only one active batch at a time. 

###### **Level 4 — Production Traceability** 

Every production operation is recorded. 

Examples include: 

- Sorting 

- Washing 

- Slicing 

- Freezing 

- Freeze Drying 

- Conventional Drying 

- Packaging 

Each operation records: 

- Input Batch 

- Output Batch 

- Operator 

- Device 

- Timestamp 

###### **Level 5 — Packaging Traceability** 

Every package stores its complete digital contents. 

Examples include: 

- Metallized Pouch 

- Carton 

- EPS Box 

- Pallet 

The system records: 

- Parent Batches 

- Package Hierarchy 

- Packaging Operator 

- Packaging Time 

###### **Level 6 — Shipment Traceability** 

The system records: 

- Shipment Number 

- Shipment Date 

- Included Packages 

- Destination (optional) 

● Shipment Operator 

Version 1 ends when shipment preparation is completed. 

## **13.4 Batch Genealogy** 

The system maintains parent-child relationships between batches. 

Example: 

Receiving Batch R001 

│ ▼ Sorting ┌────┴────┐ 

▼ ▼ 

B001       B002 

The original receiving batch remains permanently linked to all resulting batches. 

## **13.5 Batch Splitting** 

Sorting frequently divides one batch into several new batches. 

Example: 

Receiving Batch 

│ 

▼ 

Sorting 

│ 

┌──────┼────────┐ 

▼ ▼ ▼ 

Large  Medium   Small 

Each child batch preserves a reference to the original parent batch. 

## **13.6 Batch Mixing** 

The factory intentionally mixes batches in specific situations. 

Examples include: 

- Completing freeze-dryer capacity. 

- Completing drying capacity. 

- Combining leftover fresh products before export. 

Example: 

Batch A ──┐ │ Batch B ──┼────► New Production Batch │ Batch C ──┘ 

The system records all parent batches. 

No traceability information is lost. 

## **13.7 Harvest Period** 

Exact harvest dates are not required by the business. 

Instead, each receiving batch is assigned a Harvest Period. 

Examples: 

- First Week of July 

- Second Week of July 

- Third Week of August 

This provides sufficient commercial traceability while allowing operational flexibility. 

## **13.8 Supplier Settlement** 

Supplier payment is based only on: 

- Original Receiving Weight 

- Product 

- Grade 

- Size 

Subsequent: 

- Moisture loss 

- Moisture gain 

- Processing yield 

- Production mixing 

do not affect supplier settlement. 

Supplier records remain independent from production history. 

## **13.9 Weight Traceability** 

Every official weighing event is permanently recorded. 

Typical weighing stages include: 

- Receiving 

- After Sorting 

- Packaging 

The system stores: 

- Measured Weight 

- Timestamp 

- Scale 

- Operator 

- Session 

Historical measurements remain unchanged. 

## **13.10 Zone Traceability** 

The system records every movement between operational zones. 

Example: 

Receiving 

│ 

Cold Room 

│ 

Sorting 

│ 

Washing 

│ 

Freeze Dryer 

│ 

Packaging 

│ 

Shipping 

Every movement includes: 

- Timestamp 

- Operator 

- Source Zone 

- Destination Zone 

## **13.11 Package Traceability** 

Every package maintains a complete record of its contents. 

Examples: 

Consumer Package 

- Metallized Pouch 

Shipping Package 

- Carton 

- EPS Box 

- Pallet 

A shipping package may contain: 

- Multiple Products 

- Multiple Grades 

- Multiple Batches 

All package relationships are stored digitally. 

## **13.12 QR-Based Traceability** 

Every important physical object has a QR Code. 

Examples include: 

- Basket 

- Pouch 

- Carton 

- EPS Box 

- Pallet 

Scanning a QR Code immediately displays: 

- Current Status 

- Current Zone 

- Current Weight 

- Current Task 

- Parent Batch 

- Child Batches 

- Package Contents 

- Complete Timeline 

## **13.13 Timeline** 

Every business object maintains a chronological timeline. 

Example timeline: 

###### 08:00  Received 

###### 09:15  Stored in Cold Room 

###### 11:30  Sorted 

###### 12:45  Washed 

14:00  Frozen 

22:00  Freeze Dried 

###### 08:30  Packaged 

###### 15:00  Shipment Ready 

Timelines are generated automatically from recorded events. 

## **13.14 Audit Trail** 

Every traceability event includes: 

- Event Type 

- Timestamp 

- User 

- Device 

- Session 

- Previous State 

- New State 

Audit records cannot be edited or deleted. 

## **13.15 Forward Traceability** 

Forward Traceability answers: 

###### **"Where did this batch go?"** 

Example: 

Receiving Batch 

↓ 

Sorting 

↓ 

Freeze Drying 

↓ 

Packaging 

↓ 

Carton 

↓ 

Shipment 

## **13.16 Backward Traceability** 

Backward Traceability answers: 

###### **"Where did this package come from?"** 

Example: 

Shipment 

↑ 

Carton 

↑ 

Pouches 

↑ 

Production Batch 

↑ 

Receiving Batch 

↑ 

Supplier 

## **13.17 Exception Traceability** 

The system also records operational exceptions. 

Examples include: 

- Weight Warning 

- FIFO Override 

- Manual Approval 

- Print Failure 

- Rework 

- QC Rejection 

Managers can review why an exception occurred and who approved it. 

## **13.18 Traceability Philosophy** 

The system is designed around the principle that **complete traceability does not require** . **prohibiting operational flexibility** 

The factory is allowed to: 

- Split batches. 

- Merge batches. 

- Mix batches. 

- Delay sorting. 

- Complete processing loads using later arrivals. 

Instead of restricting these real-world operations, the system preserves the genealogy between all related batches, ensuring that every finished product can always be traced back to its contributing suppliers and harvest periods. 

This approach balances operational efficiency with robust product traceability, making the system practical for daily production while maintaining a reliable audit trail. 

## **14. Session-Based Operation Model** 

#### **14.1 Purpose** 

The Warehouse and Production Management System executes all operational activities using a **Session-Based Operation Model** . 

Instead of writing permanent data to the database after every user action, each business operation is performed inside a **Session** . The session temporarily stores progress, validates business rules, and commits all related data only after the operation is successfully completed. 

This model improves reliability, supports recovery from interruptions, and prevents incomplete or inconsistent transactions. 

## **14.2 What is a Session?** 

A **Session** is a temporary operational workspace representing one business activity performed by one operator. 

Examples include: 

- Receiving Session 

- Sorting Session 

- Washing Session 

- Slicing Session 

- Freeze Loading Session 

- Freeze Drying Session 

- Packaging Session 

- Shipment Preparation Session 

A session begins when an operator starts an operation and ends when that operation is either completed or cancelled. 

## **14.3 Why Session-Based Operations?** 

The factory frequently performs operations involving multiple sequential steps. 

For example: 

- Scan Basket 

- Verify Product 

- Record Weight 

- Confirm Grade 

- Create Batch 

- Print Label 

Saving each step immediately increases the risk of incomplete or inconsistent records if an interruption occurs. 

The Session Model ensures that business data is committed only after the complete workflow has been validated. 

## **14.4 Session Lifecycle** 

Every session follows the same lifecycle. 

Created 

│ 

▼ 

Assigned 

│ 

▼ 

In Progress 

│ 

▼ 

Auto Saved 

│ 

▼ 

Validated 

│ 

▼ 

Committed 

│ ▼ Completed 

Alternative endings: 

In Progress │ ├────────► Cancelled │ ├────────► Failed │ └────────► Suspended 

## **14.5 Session States** 

###### **State Description** 

Created Session has been created but not started. Assigned Assigned to an operator. In Operator is actively working. Progress Suspende Temporarily paused. d 

Auto Progress stored for recovery. Saved 

Validated Business rules successfully verified. 

Committe Permanent records written to the database. d 

Completed Operation finished successfully. 

Cancelled Operation intentionally cancelled. 

Failed Operation terminated due to an unexpected error. 

## **14.6 Session Ownership** 

A session belongs to exactly one operator at any point in time. 

Each session records: 

- Operator 

- Device 

- Terminal 

- Login Time 

- Start Time 

- End Time 

- Current Status 

Managers may reassign unfinished sessions if necessary. 

## **14.7 Session Locking** 

When an operator starts a session: 

- The associated business object (Batch, Container, Package, etc.) is locked. 

- Other users may view its status but cannot modify it. 

- The lock is released after completion, cancellation, or timeout. 

This prevents conflicting operations on the same object. 

## **14.8 Automatic Save (Auto Save)** 

The system automatically saves session progress. 

Auto Save occurs after significant actions such as: 

- QR Scan 

- Weight Capture 

- Batch Selection 

- Package Scan 

- Zone Selection 

- Process Confirmation 

If power or network is lost, the operator resumes from the latest saved step rather than restarting the operation. 

## **14.9 Session Recovery** 

Interrupted sessions may be resumed. 

Typical interruption scenarios include: 

- Power outage 

- Network failure 

- Raspberry Pi restart 

- PDA battery depletion 

- Application crash 

When the operator logs in again, the system displays recoverable sessions and allows continuation from the last saved state. 

## **14.10 Validation Before Commit** 

Before writing permanent data, the system validates: 

- Required fields completed. 

- Product consistency. 

- Grade consistency. 

- Size consistency. 

- Zone rules. 

- Weight tolerance. 

- Package capacity. 

- Configuration rules. 

- Permission checks. 

If validation fails, the session remains editable until corrected or cancelled. 

## **14.11 Commit Transaction** 

Once validation succeeds, the system performs a single database transaction. 

The transaction typically includes: 

- Batch updates 

- Inventory updates 

- Zone movement 

- Measurements 

- Event creation 

- Audit records 

- Timeline entries 

- Task updates 

If any step fails, the entire transaction is rolled back to maintain data consistency. 

## **14.12 Session Types** 

The system supports multiple predefined session types. 

**Session Type Purpose** 

Receiving Register incoming products 

|Sorting|Grade and size classifcation|
|---|---|
|Washing|Washing operation|
|Slicing|Product slicing|
|Freezing|Load or unload freezer|
|Freeze Drying|Operate freeze dryer|
|Conventional<br>Drying|Drying process|
|Packaging|Create pouches, cartons, or EPS<br>boxes|
|Shipping|Prepare shipments|
|Quality Inspection|Perform QC approval|
|Reprint|Reprint labels|



Additional session types may be configured in future versions. 

## **14.13 Temporary Session Data** 

During execution, the session stores temporary information such as: 

- Scanned QR Codes 

- Measured Weights 

- Selected Products 

- Selected Batches 

- Selected Packages 

- Operator Notes 

- Validation Results 

Temporary data is discarded after successful completion unless required for auditing. 

## **14.14 Session and Task Relationship** 

A task may create one or more sessions. 

Example: 

Work Order 

↓ 

Task 

↓ 

Session 

↓ 

Business Transaction 

A session cannot exist without a business purpose. 

## **14.15 Session and Events** 

A session generates operational events only after successful completion. 

Typical events include: 

- Batch Created 

- Weight Recorded 

- Zone Changed 

- Package Created 

- Label Printed 

- Shipment Prepared 

Events become part of the permanent audit trail. 

## **14.16 Session Timeout** 

Inactive sessions may automatically expire after a configurable period. 

Default behavior: 

- Warning displayed before timeout. 

- Unsaved work is auto-saved. 

- Session enters **Suspended** state. 

- Operator may resume later. 

Timeout duration is configurable. 

## **14.17 Multi-Device Support** 

A session is associated with the operator, not permanently tied to a specific terminal. 

Example: 

1. Operator starts a session on PDA-01. 2. PDA battery becomes depleted. 3. Operator logs into PDA-02. 4. Suspended session is resumed. 5. Work continues without data loss. 

The same principle applies to Raspberry Pi terminals. 

## **14.18 Audit Information** 

Every session records: 

- Session ID 

- Session Type 

- Operator 

- Device 

- Terminal 

- Start Time 

- End Time 

- Duration 

- Status 

- Validation Results 

- Completion Outcome 

Session history is retained for auditing and operational analysis. 

## **14.19 Benefits of the Session Model** 

The Session-Based Operation Model provides several operational advantages: 

- Prevents incomplete transactions. 

- Supports interruption recovery. 

- Improves data consistency. 

- Reduces duplicate records. 

- Simplifies operator workflows. 

- Enables automatic validation. 

- Preserves a complete operational history. 

- Supports reliable audit and traceability. 

## **14.20 Session Philosophy** 

The factory operates in a dynamic environment where interruptions, equipment changes, and production adjustments are normal. 

The Session-Based Operation Model is designed to accommodate these realities without compromising data integrity. 

By treating each operational activity as a controlled, recoverable transaction, the system ensures that production remains resilient, traceable, and easy to manage while minimizing the risk of data loss or inconsistent records. 

## **15. Configuration Philosophy** 

#### **15.1 Purpose** 

The Warehouse and Production Management System is designed around the principle that **business rules change more frequently than software** . 

To avoid unnecessary software modifications, all business values that are expected to evolve over time shall be managed through configurable master data and system settings rather than hard-coded logic. 

The objective is to allow business administrators to adapt the system to new products, grades, sizes, packaging methods, and operational policies without requiring software development. 

## **15.2 Configuration Objectives** 

The configuration framework has the following objectives: 

- Eliminate unnecessary software changes. 

- Allow rapid adaptation to business growth. 

- Support new products and production methods. 

- Reduce maintenance costs. 

- Protect database stability. 

- Keep business rules under administrator control. 

- Enable future expansion without redesign. 

## **15.3 Configuration Principles** 

The system follows these principles: 

###### **Principle 1 — Business Rules Are Configurable** 

Any value that may reasonably change during normal business operations should be configurable. 

Examples include: 

- Product Grades 

- Product Sizes 

- Packaging Types 

- Processing Parameters 

- Weight Tolerances 

- ● Zone Definitions 

###### **Principle 2 — Stable Data Model** 

Adding new business values must not require: 

- Database redesign 

- New database tables 

- Source code modification 

The database structure should remain stable even as business rules evolve. 

###### **Principle 3 — Controlled Flexibility** 

Configuration changes are performed only by authorized administrators. 

Operators cannot modify business configuration during daily production. 

###### **Principle 4 — Immediate Availability** 

Once activated, configuration changes become available throughout the system without restarting the application. 

###### **Principle 5 — Historical Integrity** 

Changes to configuration shall not alter historical records. 

For example: 

If Grade **A+** is introduced today, historical batches processed under Grade **A** shall remain unchanged. 

Likewise, renaming a product size shall not modify historical production data. 

## **15.4 Configuration Categories** 

The system organizes configuration into several logical categories. 

#### **Product Configuration** 

Defines business characteristics of products. 

Examples: 

- Product Categories 

- Products 

- Grades 

- Sizes 

- Harvest Period Definitions 

- Units of Measure 

Example: 

Fresh Truffle 

Grades: 

A 

A+ 

Industrial 

Sizes: 

<12g 

12–18g 

18–30g 

30g+ 

Administrators can add new grades or sizes without software changes. 

#### **Packaging Configuration** 

Defines packaging structures. 

Examples: 

- Metallized Pouch Types 

- Carton Types 

- EPS Box Types 

- Pallet Types 

Configuration includes: 

- Maximum Capacity 

- Default Label Template 

- Package Hierarchy 

- Barcode Format 

#### **Container Configuration** 

Defines reusable production containers. 

Examples: 

- Plastic Basket 

- Plastic Crate 

Configurable properties: 

- Dimensions 

- Maximum Weight 

- Reusable Status 

- Cleaning Required 

- QR Code Format 

#### **Zone Configuration** 

Defines operational areas inside the factory. 

Examples: 

- Receiving 

- Cold Room 

- Sorting 

- Washing 

- Slicing 

- Freezing 

- Freeze Drying 

- Packaging 

- Shipping 

- Quarantine 

Additional zones can be introduced without modifying the software. 

#### **Process Configuration** 

Defines available production processes. 

Examples: 

- Sorting 

- Washing 

- Slicing 

- Freezing 

- Freeze Drying 

- Conventional Drying 

Each process may define: 

- Input Requirements 

- Output Rules 

- Required Skills 

- Allowed Roles 

- Validation Rules 

#### **Task Configuration** 

Administrators may configure: 

- Task Priorities 

- Task Categories 

- Auto Assignment Rules 

- FIFO Rules 

- Default Time Limits 

Managers may override priorities during production when necessary. 

#### **Validation Configuration** 

Business validation rules are configurable. 

Examples include: 

- Weight Tolerance 

- Maximum Package Capacity 

- Zone Restrictions 

- Required Approvals 

- Mandatory Scanning 

- Label Requirements 

The system generates warnings or blocks operations according to these rules. 

#### **Device Configuration** 

Defines hardware connected to the system. 

Examples: 

- Raspberry Pi Terminals 

- Android PDAs 

- Printers 

- Digital Scales 

- Barcode Scanners 

Configuration includes: 

- Device Name 

- Device Type 

- Network Address 

- Assigned Area 

- Status 

#### **User & Role Configuration** 

Administrators configure: 

- Users 

- Roles 

- Skills 

- Permissions 

- Terminal Access 

- Default Dashboards 

A single user may have multiple roles. 

#### **Print Configuration** 

Administrators manage: 

- Label Templates 

- QR Formats 

- Printer Assignment 

- Print Queue Rules 

- Reprint Permissions 

Multiple label templates may exist for the same package type. 

#### **Notification Configuration** 

Examples: 

- Weight Warning Thresholds 

- FIFO Alerts 

- Equipment Offline Alerts 

- Pending Label Alerts 

- Overdue Task Alerts 

Notifications can be enabled, disabled, or adjusted without software modification. 

## **15.5 Configuration Versioning** 

Every configuration change shall be recorded. 

Each record includes: 

- Configuration Item 

- Previous Value 

- New Value 

- User 

- Date 

- Time 

- Reason (optional) 

Historical configuration changes remain available for audit purposes. 

## **15.6 Configuration Approval** 

Certain configuration changes may require approval before activation. 

Examples include: 

- New Product 

- New Grade 

- New Package Type 

- New Process 

- Validation Rule Changes 

Approval requirements are configurable. 

## **15.7 Configuration Impact** 

Before saving significant changes, the system should display the expected impact. Examples: 

Adding a new product grade affects: 

- Receiving 

- Sorting 

- Packaging 

- Reporting 

- Filters 

Changing a package type affects: 

- Packaging 

- Printing 

- Shipment Preparation 

This helps administrators understand the operational consequences of configuration changes. 

## **15.8 Default Configuration** 

Version 1 shall be delivered with an initial configuration covering the current factory operations, including: 

- Existing Products 

- Existing Grades 

- Existing Sizes 

- Existing Zones 

- Existing Package Types 

- Existing Production Processes 

- Existing User Roles 

- Existing Devices 

Administrators may extend these configurations as the business grows. 

## **15.9 Configuration vs Operational Data** 

The system clearly separates from **Operational Data** . **Configuration Data** 

**how the factory operates** . Configuration Data defines 

Examples: 

- Grade Definitions 

- Size Definitions 

- Process Definitions 

- Zone Definitions 

###### Operational Data records **what actually happened** . 

Examples: 

- Receiving Batch 

- Weight Measurement 

- Sorting Session 

- Packaging Session 

- Shipment 

Operational records always reference the configuration that was active at the time of execution, preserving historical accuracy. 

## **15.10 Configuration Philosophy** 

The system is designed to evolve with the business rather than forcing the business to evolve around the software. 

Business administrators should be able to introduce new products, grades, sizes, packaging methods, production processes, and operational policies through configuration alone. 

Software development should only be required for introducing fundamentally new capabilities—not for routine business changes. 

This philosophy ensures that the platform remains stable, flexible, and maintainable while supporting the long-term growth of the factory without repeated redesign or costly customization. 

## **16. Version 1 Boundaries** 

#### **16.1 Purpose** 

**Version 1 (V1)** of the Warehouse and This document defines the functional boundaries of Production Management System. 

Its objective is to clearly distinguish between: 

- Features included in Version 1 

- Features intentionally excluded from Version 1 

- Future enhancement opportunities 

Defining these boundaries helps keep the project achievable, reduces implementation risk, and ensures that the first production release focuses on the core operational needs of the factory. 

## **16.2 Version 1 Philosophy** 

Version 1 is designed to digitize the complete operational workflow of the factory without introducing unnecessary complexity. 

The primary objective is to replace manual tracking with a reliable, traceable, and production-ready system. 

Features that do not directly support daily operations are intentionally deferred to future versions. 

## **16.3 Functional Scope of Version 1** 

Version 1 includes the complete operational lifecycle from product receiving to shipment preparation. 

Receiving 

│ 

▼ 

Cold Storage 



<!-- Start of picture text -->
│<br>▼<br>Sorting<br>│<br>├──────────────┐<br>▼ ▼<br>Fresh Export     Processing<br>│<br>┌──────────────┼──────────────┐<br>▼ ▼ ▼<br> Freezing     Freeze Drying   Conventional Drying<br>│ │ │<br>└──────────────┴──────────────┘<br>│<br>▼<br>                 Packaging<br>│<br>▼<br>              Shipment Preparation<br>│<br>▼<br>              Ready for Dispatch<br><!-- End of picture text -->

## **16.4 Included Features** 

#### **Product Receiving** 

###### Included: 

- Supplier Registration 

- Receiving Sessions 

- Product Registration 

- Grade Selection 

- Size Selection 

- Weight Recording 

- Receiving Batch Creation 

- Basket Assignment 

- QR Registration 

#### **Inventory Management** 

###### Included: 

- Real-Time Inventory 

- Basket Tracking 

- Batch Tracking 

- Zone Tracking 

- Inventory Search 

- Weight History 

- Batch Status 

#### **Production Management** 

###### Included: 

- Sorting 

- Washing 

- Slicing 

- Freezing 

- Freeze Drying 

- Conventional Drying 

- Batch Splitting 

- Batch Merging 

- Controlled Batch Mixing 

#### **Packaging** 

###### Included: 

- Consumer Package Creation 

- Carton Assembly 

- EPS Box Assembly 

- Pallet Assembly 

- Package Hierarchy 

- Mixed Product Cartons 

- Mixed Grade Cartons 

#### **Shipping Preparation** 

###### Included: 

- Shipment Assembly 

- Carton Verification 

- EPS Verification 

- Pallet Verification 

- Shipment Readiness 

The transportation process begins after this point and is outside Version 1. 

#### **Traceability** 

###### Included: 

- Batch Genealogy 

- Parent / Child Relationships 

- Supplier Traceability 

- Package Traceability 

- Shipment Traceability 

- Harvest Period Tracking 

- Timeline View 

#### **Task Management** 

Included: 

- My Tasks 

- Task Assignment 

- Automatic Recommendations 

- QR-Based Task Execution 

- FIFO Recommendation 

- Manager Priority Override 

#### **Session Management** 

###### Included: 

- Session Lifecycle 

- Session Recovery 

- Auto Save 

- Transaction Validation 

- Rollback Protection 

#### **Hardware Integration** 

###### Included: 

- Raspberry Pi Terminals 

- Android Industrial PDA 

- Barcode Scanner 

- QR Scanner 

- Digital Scale 

- Thermal Label Printer 

#### **Reporting** 

###### Included: 

- Inventory Reports 

- Production Reports 

- Batch Reports 

- Packaging Reports 

- Shipment Reports 

- Traceability Reports 

- Audit Reports 

#### **Configuration** 

Included: 

- Products 

- Grades 

- Sizes 

- Zones 

- Package Types 

- Processes 

- Roles 

- Devices 

- Validation Rules 

## **16.5 Operational Principles Included** 

Version 1 fully supports the factory's current operating model, including: 

- One active product per basket. 

- One grade and one size per receiving basket. 

- Reusable baskets with permanent QR codes. 

- Intentional batch mixing during sorting and processing. 

- Supplier settlement based on receiving weight. 

- Harvest Period tracking instead of exact harvest date. 

- Mixed products and grades inside shipping cartons or EPS boxes. 

- Warning-based validation rather than unnecessary operational blocking. 

- Role selection on any terminal. 

- Mobile PDA workflows and fixed Raspberry Pi terminals working together. 

## **16.6 Validation Philosophy** 

Version 1 emphasizes operational continuity. 

When business rules are violated: 

- The system should issue warnings. 

- Significant exceptions should be flagged for management review. 

- Production should continue whenever possible. 

Examples include: 

- Unusual weight changes. 

- FIFO overrides. 

- Mixed production batches. 

- Pending labels. 

Blocking an operation should be reserved for critical data integrity or safety issues. 

## **16.7 Features Excluded from Version 1** 

The following capabilities are intentionally excluded to keep the first release focused and practical. 

###### **ERP Integration** 

Examples: 

- SAP 

- Microsoft Dynamics 

- Odoo 

###### **Accounting** 

Excluded: 

- Financial Accounting 

- Cost Accounting 

- Supplier Payments 

- Customer Invoicing 

Supplier settlement calculations remain outside the system. 

###### **Laboratory Information Management** 

Excluded: 

- Chemical Analysis 

- Microbiology 

- Moisture Testing 

- Laboratory Certificates 

Version 1 supports operational quality checks only. 

###### **Machine Automation** 

Excluded: 

- PLC Integration 

- Automatic Machine Control 

- IoT Sensor Networks 

- SCADA Integration 

Machine operation remains manual. 

###### **Production Scheduling Optimization** 

Excluded: 

- AI Production Planning 

- Automatic Capacity Optimization 

- Automatic Machine Scheduling 

Production priorities remain under manager control. 

###### **Customer Relationship Management (CRM)** 

Excluded: 

- Customer Management 

- Sales Pipeline 

- Quotations 

- Marketing 

###### **Purchasing** 

Excluded: 

- Purchase Orders 

- Procurement Workflow 

- Supplier Contracts 

Only product receiving is included. 

###### **Human Resources** 

Excluded: 

- Payroll 

- Attendance 

- Leave Management 

- Employee Evaluation 

User authentication and roles are included only for system access. 

###### **Transportation Management** 

Excluded: 

- Truck Scheduling 

- Route Planning 

- Carrier Management 

- Delivery Tracking 

Version 1 ends when shipments are ready for dispatch. 

###### **Advanced Analytics** 

Excluded: 

- AI Forecasting 

- Predictive Maintenance 

- Demand Forecasting 

- Machine Learning Models 

Standard operational reports are sufficient for Version 1. 

## **16.8 Future Expansion Opportunities** 

The system architecture has been designed to support future enhancements without redesign. 

Potential Version 2+ modules include: 

- ERP Integration 

- Financial Accounting 

- Customer Management 

- Supplier Portal 

- Laboratory Management 

- IoT Equipment Monitoring 

- AI Production Optimization 

- Mobile Manager Dashboard 

- Multi-Warehouse Management 

- Multi-Factory Support 

- Business Intelligence Dashboards 

- API Integration with External Systems 

These features are outside the scope of Version 1 but can be added as independent modules. 

## **16.9 Success Criteria for Version 1** 

Version 1 will be considered successful if it can: 

- Digitally manage all receiving operations. 

- Track every basket, batch, package, and shipment. 

- Support both fresh export and processing workflows. 

- Preserve complete batch genealogy. 

- Guide operators through daily tasks using fixed and mobile terminals. 

- Maintain real-time inventory visibility. 

- Generate reliable labels and reports. 

- Provide complete operational traceability. 

- Operate continuously in a production environment with minimal manual paperwork. 

## **16.10 Version 1 Boundary Statement** 

Version 1 is intentionally focused on **factory execution** , not enterprise management. 

It delivers a complete operational platform covering receiving, inventory, production, packaging, shipment preparation, traceability, task management, and configuration. 

Functions related to finance, ERP, laboratory systems, transportation, advanced planning, and enterprise analytics are deliberately excluded to ensure that the first release remains practical, reliable, and achievable. 

This clear scope enables faster implementation, easier user adoption, and a stable foundation for future expansion while addressing the factory's immediate operational requirements. 

## **17. Future Expansion Strategy** 

#### **17.1 Purpose** 

Although Version 1 is intentionally focused on core factory operations, the system architecture has been designed to support future business growth without requiring fundamental redesign. 

This document outlines the long-term expansion strategy and identifies the major functional areas that can be added in future versions while preserving compatibility with Version 1. 

The goal is **not** to define future project requirements, but to ensure that architectural decisions made today do not limit tomorrow's business needs. 

## **17.2 Expansion Philosophy** 

The system follows a simple principle: 

###### **Build a stable operational core first, then expand through independent modules.** 

Version 1 provides the foundation: 

- Receiving 

- Inventory 

- Production 

- Packaging 

- Shipping Preparation 

- Traceability 

- ● Configuration 

Future versions extend these capabilities without changing the core operational model. 

## **17.3 Architectural Strategy** 

The architecture is based on a modular design. 

Core Platform 

│ 



<!-- Start of picture text -->
┌───────────────────┼────────────────────┐<br>│ │ │<br><!-- End of picture text -->

Version 1       Future Modules      External Systems 

The Core Platform remains stable while additional modules are connected through standard interfaces. 

## **17.4 Expansion Principles** 

Future development should follow these principles: 

- Preserve existing database structures whenever possible. 

- Extend functionality through new modules rather than modifying existing ones. 

- Maintain backward compatibility with operational data. 

- Avoid disrupting production workflows. 

- Continue using configuration instead of software customization where practical. 

## **17.5 Potential Version 2 Modules** 

The following modules are logical candidates for future implementation. 

#### **ERP Integration** 

Purpose: 

Exchange operational data with enterprise systems. 

Examples: 

- Inventory synchronization 

- Shipment confirmation 

- Product master synchronization 

Typical integrations: 

- SAP 

- Microsoft Dynamics 

- Odoo 

#### **Financial Module** 

Possible capabilities: 

- Production Cost Calculation 

- Yield Analysis 

- Inventory Valuation 

- Supplier Settlement 

- Cost Center Reporting 

Version 1 intentionally excludes financial processing. 

#### **Laboratory Management (LIMS)** 

Possible capabilities: 

- Moisture Analysis 

- Microbiological Testing 

- Quality Certificates 

- Sample Management 

- Laboratory Reports 

Operational quality inspections performed in Version 1 remain unchanged. 

#### **Customer Management** 

Possible capabilities: 

- Customer Database 

- Sales Orders 

- Export Orders 

- Contract Management 

- Customer-Specific Packaging 

#### **Purchasing Module** 

Possible capabilities: 

- Purchase Orders 

- Supplier Contracts 

- Material Procurement 

- Packaging Material Inventory 

Receiving workflows from Version 1 can be reused. 

#### **Maintenance Management** 

Possible capabilities: 

- Equipment Maintenance Plans 

- Calibration Scheduling 

- Preventive Maintenance 

- Spare Parts Inventory 

- Maintenance History 

#### **Business Intelligence** 

Possible capabilities: 

- Executive Dashboards 

- KPI Monitoring 

- Yield Trends 

- Inventory Trends 

- Production Performance 

- Capacity Utilization 

Operational reports from Version 1 become the primary data source. 

#### **AI Decision Support** 

Potential future capabilities: 

- Processing Recommendations 

- Inventory Prioritization 

- Capacity Planning 

- Production Forecasting 

- Exception Detection 

The AI layer should provide recommendations only, leaving final decisions to managers. 

#### **Multi-Factory Support** 

Possible capabilities: 

- Multiple Production Sites 

- Centralized Management 

- Factory Comparison 

- Inter-Factory Transfers 

This requires adding a Factory entity while preserving the existing operational model. 

#### **External API Platform** 

Possible capabilities: 

- ERP Integration 

- Customer Portal 

- Supplier Portal 

- Mobile Applications 

- Third-Party Systems 

A secure REST API can expose selected business functions without affecting the internal architecture. 

## **17.6 Mobile Expansion** 

Version 1 already includes Android industrial PDAs for production operators. 

Future mobile capabilities may include: 

- Manager Dashboard 

- Remote Production Monitoring 

- Approval Workflows 

- Inventory Search 

- Shipment Verification 

- Push Notifications 

No changes to the core production workflow are required. 

## **17.7 IoT Integration** 

Future integration with production equipment may include: 

- PLC Connectivity 

- Machine Status Monitoring 

- Temperature Sensors 

- Humidity Sensors 

- Energy Monitoring 

- Automated Data Collection 

These features can complement manual production workflows introduced in Version 1. 

## **17.8 Advanced Traceability** 

Future enhancements may include: 

- RFID Support 

- GS1 Standards 

- Customer Recall Management 

- Regulatory Compliance Reporting 

- Digital Product Passports 

The existing genealogy model provides a strong foundation for these capabilities. 

## **17.9 Cloud Deployment** 

The system architecture supports future cloud deployment options, including: 

- Centralized Cloud Server 

- Hybrid Deployment 

- Remote Administration 

- Secure VPN Access 

No changes to the business model are required. 

## **17.10 Internationalization** 

Future versions may support: 

- Multiple Languages 

- Multiple Time Zones 

- Multiple Currencies 

- Localized Date Formats 

- Country-Specific Regulatory Requirements 

The data model is designed to accommodate international operations. 

## **17.11 Reporting Expansion** 

Potential reporting enhancements include: 

- Interactive Dashboards 

- Custom Report Builder 

- Scheduled Reports 

- Email Distribution 

- Data Export APIs 

- Advanced Analytics 

Operational reports created in Version 1 serve as the foundation. 

## **17.12 Scalability Strategy** 

The platform is expected to grow by: 

- Adding new products. 

- Adding new grades. 

- Adding new package types. 

- Adding new production processes. 

- Adding new users. 

- Adding new terminals. 

- Adding new warehouses. 

- Adding new factories. 

These expansions should require configuration rather than redesign whenever possible. 

## **17.13 Design Constraints** 

While the architecture is prepared for expansion, future development should respect several constraints: 

- Preserve data integrity. 

- Maintain complete traceability. 

- Avoid unnecessary complexity. 

- Keep operator workflows simple. 

- Minimize disruption to existing production. 

New capabilities should integrate with the existing operational model rather than replacing it. 

## **17.14 Long-Term Vision** 

The long-term vision is to evolve the system from a production execution platform into a fully integrated manufacturing information system. 

This evolution should occur incrementally, allowing each new module to deliver measurable business value without compromising the reliability or simplicity of the operational core. 

## **17.15 Future Expansion Summary** 

The architecture deliberately separates **today's operational requirements** from **tomorrow's business opportunities** . 

Version 1 focuses on executing factory operations efficiently and reliably. 

Future versions may extend the platform into areas such as finance, laboratory management, ERP integration, customer management, maintenance, artificial intelligence, business intelligence, and multi-site operations. 

Because the system is built on a modular, configuration-driven architecture, these enhancements can be introduced progressively while preserving the investment made in the Version 1 platform and minimizing disruption to daily factory operations. 



<!-- Start of picture text -->
PROCESS_CONFIG WORK_ORDER<br>WOID (PK)<br>Arocess 1D (PK) ——efines _____y | ProcessID (FK)<br>Name Status ae<br>RequiresWeight aerioriiy ~~ generatesa TASK<br>~~. | TaskiD (PK)<br>WOID (FK)<br>CRER SICK SS- OperatorD (FK) | _—<br>OperatoriDNameRole (PK) |——— Status SS~opens=SS. SESSION EVENT<br>a SessionID (PK) EventiD (PK)<br>DevicelDDENICE used by» | TaskID (Fk) |——Prodvcss_, | SessionID (FK)<br>PRODUCT_CONFIG Type (PK) |_————_" DevicelD (FK) EventType"<br>ConfigID (PK) Onlineyp Status ObjectType<br>ProductiD (FK)<br>defines ——¥ wee<br>——— ee Code<br>PRODUCT eea<br>ProductID (PK)<br>Name MEASUREMENT<br>Category SCALE MeasurelD (PK)<br>ScalelD (PK) records<br>produces Name oe | BatchIDScalelD (FK)(FK)<br>Net<br>measured b<br>BATCH<br>BatchID (PK)<br>SUPPTIER ProductiD (FK) BATCH_LINKU<br>SupplieriD (PK) supplies GradeConfigID (FK) parent of ParentBatchID (FK)<br>Name SizeConfigID (FK) ChildBatchID (FK)<br>SupplierlD (FK) Weight<br>HarvestPeriod located at<br>Status<br>packed inte BATCH_LOCATION<br>ZONE Location!D (PK)<br>ZonelD (PK) contains’ \ BatchID (FK)<br>Name \ ZonelD (FK)<br>Capacity \ _w | ContainerlD (FK)<br>roids" FromTime<br>Pa \<br>CONTAINER [ieot a<br>ContaineriD (PK) ‘.<br>QRCode PACKAGE CONTENT<br>Co PackagelD (FK)<br>BatchID (FK)<br>nested in uy | Weight<br>fe “\ eontaine) =~<br>eyPACKAGE_TYPE PACKAGE a<br>PackagelD (PK)<br>EECEESETVEEINNameckageTypeleee ERT ——_—sefines__y. | packageTypelD (FK)<br>ParentPackagelD (FK)<br>RequiresQR Status<br><!-- End of picture text -->

# B. Business Workflow 

###### **B. Business Workflow** 

**1. End-to-End Business Workflow** 

**2. Receiving Workflow** 

**3. Cold Storage Workflow** 

**4. Sorting Workflow** 

**5. Washing Workflow** 

**6. Slicing Workflow** 

**7. Fresh Export Workflow** 

**8. Freezing Workflow** 

**9. Freeze Drying Workflow 10. Conventional Drying Workflow 11. Packaging Workflow 12. Inventory Movement Workflow 13. Shipping Workflow 14. Label Printing Workflow 15. Reprint Workflow** 

**16. Traceability Workflow 17. Exception Workflow 18. Manager Override Workflow 19. Session Workflow 20.Task Workflow 21. Audit Workflow 22.Configuration Workflow 23.End-to-End Operational Example** 

## **1 End-to-End Business Workflow** 

## **1.1 Purpose** 

**This section describes the complete operational workflow of the factory from the moment a supplier delivers fresh products until the finished products are shipped to customers.** 

**The objective is to define the movement of products, batches, containers, packages, and information throughout the entire operation while maintaining inventory accuracy, operational efficiency, and product traceability.** 

**This workflow serves as the foundation for all business rules, database design, user interfaces, APIs, and operational scenarios.** 

## **1.2 Business Philosophy** 

**The factory manages products through a container-based workflow rather than tracking individual items.** 

**The primary tracked object is the Basket (Container).** 

**Products move through the factory by moving containers between operational zones and production processes.** 

###### **Throughout the workflow, the system tracks:** 

- **Product** 

- **Batch** 

- **Harvest Period** 

- **Supplier Contribution** 

- **Quantity** 

- **Weight** 

- **Location** 

- **Processing Status** 

- **Packaging Status** 

**The system is designed to support controlled batch mixing while preserving traceability at the batch level.** 

## **1.3 High-Level Workflow** 

###### **Supplier Delivery** 

- **│ ▼** 

###### **Receiving** 

- **│ ▼** 

- **Receiving Weight │ ▼** 

###### **Basket Creation** 

**│ ▼ Cold Storage │ ▼ Manager Priority / FIFO │ ▼ Sorting │ ├──────────────────────────────┐ ▼ ▼ Fresh Export                    Processing │** 



<!-- Start of picture text -->
┌─────────────────────┼────────────────────┐<br>▼ ▼ ▼<br>             Freezing           Freeze Drying      Conventional Drying<br>│ │ │<br>└─────────────────────┴────────────────────┘<br>│<br>▼<br>                                   Packaging<br>│<br>▼<br>                                 Carton Assembly<br>│<br>▼<br>                              EPS Box / Pallet Assembly<br>│<br>▼<br>                              Shipment Preparation<br>│<br>▼<br>                                 Ready for Dispatch<br><!-- End of picture text -->

## **1.4 Receiving Phase** 

**The workflow begins when fresh products arrive at the factory. Typical activities include:** 

- **Supplier identification** 

- **Product verification** 

- **Initial weighing** 

- **Product registration** 

- **Batch creation** 

- **Basket assignment** 

- **QR registration** 

- **Transfer to Cold Storage** 

###### **Each receiving basket contains:** 

- **One Product** 

- **One Grade** 

- **One Size Range** 

**Receiving weight is the official commercial weight used for supplier settlement.** 

## **1.5 Cold Storage Phase** 

**After receiving, baskets are transferred to cold storage.** 

**The cold storage acts as the primary inventory buffer.** 

**Products remain in cold storage until production planning determines their next destination.** 

**Normally, the system recommends FIFO (First In, First Out).** 

**However, managers may override FIFO and prioritize baskets based on:** 

- **Product freshness** 

- **Customer orders** 

- **Processing requirements** 

- **Production capacity** 

- **Quality considerations** 

###### **Manager overrides are recorded for auditing.** 

## **1.6 Sorting Phase** 

**Sorting transforms incoming supplier grades into factory production grades.** 

###### **Operators separate products according to:** 

- **Size** 

- **Quality** 

- **Destination** 

###### **Sorting may:** 

- **Split one receiving batch into multiple production batches.** 

- **Merge multiple receiving batches into one production batch.** 

**Batch mixing is an accepted business process.** 

**Products originating from different suppliers may intentionally be merged after sorting.** 

**The system records supplier contributions but does not require complete physical separation after sorting.** 

## **1.7 Production Decision** 

**After sorting, each production batch is assigned a destination.** 

**Possible destinations include:** 

###### **Fresh Export** 

**Products prepared for immediate shipment.** 

###### **Freezing** 

**Products stored in frozen condition for future processing.** 

###### **Freeze Drying** 

**Products prepared for freeze-dried finished goods.** 

###### **Conventional Drying** 

**Products processed through traditional drying methods.** 

**Destination decisions are based on business requirements rather than system automation.** 

## **1.8 Fresh Export Workflow** 

**Fresh export products follow this sequence:** 

###### **Sorting** 

###### **↓** 

###### **Packing into Nets** 

###### **↓** 

###### **Storage Basket** 

###### **↓** 

###### **Shipment Planning** 

###### **↓** 

###### **EPS Box Assembly** 

###### **↓** 

###### **Shipment Preparation** 

###### **Important characteristics:** 

- **Nets are not individually labeled.** 

- **Multiple nets are stored inside baskets.** 

- **Multiple product sizes may be packed into the same EPS shipping box.** 

**● Remaining quantities may be combined with later production before net packing.** 

## **1.9 Freezing Workflow** 

**Products selected for freezing are transferred to the freezing area.** 

###### **Typical activities:** 

- **Basket selection** 

- **Washing (if required)** 

- **Slicing (if required)** 

- **Loading freezer** 

- **Freezing completion** 

- **Frozen inventory registration** 

###### **Frozen batches remain available for later processing.** 

## **1.10 Freeze Drying Workflow** 

**Freeze drying may occur immediately after freezing or after frozen storage.** 

**Workflow:** 

**Frozen Batch** 

###### **↓** 

**Freeze Dryer Loading** 

**↓** 

###### **Freeze Dry Cycle** 

###### **↓** 

###### **Finished Batch** 

###### **↓** 

**Packaging** 

**A freeze dryer cycle may contain products originating from multiple production batches.** 

**The system records all parent-child relationships.** 

## **1.11 Conventional Drying Workflow** 

**Products assigned to conventional drying follow a similar process.** 

**Processing Batch** 

**↓** 

**Drying** 

**↓** 

**Finished Batch** 

**↓** 

###### **Packaging** 

###### **Drying cycles may also contain mixed batches.** 

## **1.12 Packaging Workflow** 

**Finished products are packed into consumer packages.** 

**Packaging creates the first individually traceable finished units.** 

###### **Examples:** 

- **Metallized Pouches** 

- **Retail Packages** 

###### **Each package receives:** 

- **Unique QR Code** 

- **Production Date** 

- **Product Information** 

- **Batch Reference** 

###### **Package weight is recorded during packaging.** 

## **1.13 Carton Assembly** 

**Consumer packages are scanned into cartons.** 

**Workflow:** 

**Scan Package** 

**↓** 

###### **Validate** 

###### **↓** 

###### **Add to Carton** 

###### **↓** 

###### **Repeat** 

###### **↓** 

###### **Complete Carton** 

###### **↓** 

###### **Print Carton Label** 

###### **Operators do not scan cartons during assembly.** 

**The carton is created only after all packages have been scanned.** 

**The system maintains a complete list of package serial numbers contained inside each carton.** 

## **1.14 EPS Box Assembly** 

###### **For fresh exports, cartons or nets are assembled into EPS shipping boxes.** 

###### **An EPS box may contain:** 

- **Multiple package types** 

- **Multiple sizes** 

- **Multiple grades** 

###### **The system stores the complete contents of each EPS box.** 

## **1.15 Shipment Preparation** 

###### **Shipment preparation includes:** 

- **Shipment creation** 

- **Package assignment** 

- **Carton verification** 

- **EPS verification** 

- **Shipping documentation** 

###### **Once completed, the shipment status becomes:** 

###### **Ready for Dispatch** 

###### **Transportation activities begin outside the scope of Version 1.** 

## **1.16 Inventory Movement** 

**Throughout the workflow, inventory continuously moves between operational zones.** 

**Examples:** 

**Receiving → Cold Storage** 

**Cold Storage → Sorting** 

**Sorting → Washing** 

**Washing → Freezing** 

**Freezing → Freeze Drying** 

###### **Freeze Drying → Packaging** 

###### **Packaging → Warehouse** 

###### **Warehouse → Shipping** 

###### **Every movement generates an inventory event.** 

## **1.17 Weight Management** 

**Weight measurements occur only at defined business checkpoints.** 

**Mandatory weighing stages:** 

- **Receiving** 

- **After Sorting** 

- **Packaging** 

###### **No weighing is performed during:** 

- **Washing** 

- **Slicing** 

- **Freezing** 

- **Freeze Drying** 

- **Conventional Drying** 

###### **Business rules allow natural weight variations during processing.** 

**Abnormal changes generate warnings for manager review but do not automatically block operations.** 

## **1.18 Traceability** 

**The system maintains traceability through all operational stages.** 

**Traceability includes:** 

- **Supplier Contributions** 

- **Receiving Batch** 

- **Production Batch** 

- **Processing Batch** 

- **Package** 

- **Carton** 

- **EPS Box** 

###### **● Shipment** 

**Exact harvest dates are not required.** 

**The system tracks the Harvest Period (e.g., "First Week of July"), which is sufficient for operational and commercial traceability.** 

## **1.19 Task-Driven Operations** 

**Operational work is executed through tasks.** 

**Operators may work in two ways:** 

###### **Task-Driven** 

**The system assigns the next recommended task based on workflow priorities.** 

###### **QR-Driven** 

**The operator scans a basket or package, and the system identifies the current status and displays the next valid operation.** 

**Both approaches follow the same business rules.** 

## **1.20 Session-Based Execution** 

**Every operational activity is executed within a Session.** 

###### **Examples:** 

- **Receiving Session** 

- **Sorting Session** 

- **Washing Session** 

- **Packaging Session** 

###### **A session:** 

- **Tracks progress.** 

- **Performs validation.** 

- **Supports auto-save.** 

- **Can be resumed after interruption.** 

- **Commits data only after successful completion.** 

## **1.21 Exception Handling** 

**The system is designed to support continuous production.** 

###### **Examples of exceptions include:** 

- **Weight outside tolerance** 

- **FIFO override** 

- **Label printing failure** 

- **Missing basket** 

- **Delayed processing** 

- **Mixed supplier batches** 

- **Equipment unavailable** 

**In most cases, the system issues warnings or flags for management review rather than blocking operations.** 

## **1.22 End-to-End Traceability Example** 

**Farmer A (40 kg)** 

**Farmer B (25 kg)** 

###### **↓** 

###### **Receiving** 

###### **↓** 

###### **Cold Storage** 

###### **↓** 

###### **Sorting** 

###### **↓** 

###### **Mixed Production Batch** 

###### **↓** 

###### **Freeze** 

###### **↓** 

###### **Freeze Dry** 

###### **↓** 

###### **Packaging** 

###### **↓** 

###### **Retail Pouches** 

**↓** 

###### **Carton** 

###### **↓** 

###### **Shipment** 

###### **The system records that the finished products originated from both suppliers while recognizing that individual pouches cannot be attributed to a single supplier after the controlled mixing process.** 

## **1.23 Workflow Principles** 

**The end-to-end workflow is governed by the following principles:** 

- **Products move through containers rather than individual items.** 

- **Each basket contains only one product, one grade, and one size at a time.** 

- **Controlled batch mixing is an accepted and traceable business process.** 

- **Harvest Period is tracked instead of exact harvest dates.** 

- **Tasks may be executed through recommendations or QR scanning.** 

- **All significant operations occur within sessions.** 

- **Inventory movements generate permanent audit events.** 

- **Label printing is integrated into operational workflows with support for reprinting.** 

- **Business exceptions generate warnings before blocking production whenever possible.** 

## **1.24 Workflow Summary** 

**The factory workflow is designed to maximize operational flexibility while maintaining reliable traceability.** 

**The system accommodates real-world production practices such as delayed sorting, batch merging, mixed processing cycles, partial packaging, and manager-driven prioritization without compromising inventory integrity or auditability.** 

**By combining container-based inventory management, session-controlled operations, configurable business rules, and comprehensive traceability, the workflow provides a robust foundation for all Version 1 factory operations.** 

## **2 Receiving Workflow** 

## **2.1 Purpose** 

**The Receiving Workflow manages the complete process of accepting products from suppliers into the factory.** 

###### **Its objectives are to:** 

- **Register every delivery.** 

- **Record the official commercial receiving weight.** 

- **Assign products to baskets.** 

- **Create the initial inventory records.** 

- **Generate the first traceable batches.** 

- **Transfer products to Cold Storage.** 

###### **Receiving is the first operational step in the traceability chain. Every product entering the factory must pass through this workflow.** 

## **2.2 Workflow Overview** 

###### **Supplier Arrival** 

- **│** 

- 

###### **Create Receiving Session** 

- **│** 

- 

###### **Supplier Verification** 

- **│** 

- 

###### **Product Selection** 

- **│** 

**▼** 

###### **Select Grade & Size** 

**│** 

**▼** 

###### **Assign Basket** 

**│** 

**▼** 

###### **Weigh Basket** 

**│** 

**▼** 

###### **Create Receiving Batch** 

**│** 

**▼** 

###### **Print Basket Label (if needed)** 

**│** 

**▼** 

###### **Move Basket to Cold Storage** 

**│** 

**▼** 

###### **Close Receiving Session** 

## **2.3 Business Objective** 

**Receiving establishes the initial identity of every product entering the factory. At this stage the system determines:** 

- **Who supplied the product.** 

- **What product was delivered.** 

- **Product grade.** 

- **Product size.** 

- **Official receiving weight.** 

- **Harvest Period.** 

- **Receiving date.** 

- **Initial storage location.** 

**All downstream operations depend on the accuracy of this information.** 

## **2.4 Receiving Session** 

**Every receiving operation begins by opening a Receiving Session.** 

**A session groups all deliveries processed during one operational period. Example:** 

**Receiving Session** 

**Date:** 

**2026-07-08** 

**Operator:** 

**Ali** 

**Shift:** 

**Morning** 

**A session remains active until the operator finishes all deliveries.** 

**If interrupted, it can later be resumed.** 

## **2.5 Supplier Identification** 

**The operator selects the supplier.** 

**The supplier may already exist or be created if authorized.** 

###### **Information includes:** 

- **Supplier Name** 

- **Supplier Code** 

- **Contact Information** 

- **Region** 

- **Settlement Reference** 

###### **Supplier selection is mandatory.** 

## **2.6 Harvest Period** 

**Instead of recording the exact harvest date, the system records a configurable Harvest Period.** 

###### **Examples:** 

- **First Week of July** 

- **Second Week of July** 

- **Early Summer** 

- **Autumn Harvest** 

**This level of detail is sufficient for business traceability and avoids unnecessary operational complexity.** 

## **2.7 Product Selection** 

**The operator selects the product being received.** 

###### **Examples:** 

- **Fresh Black Truffle** 

- **Fresh Raspberry** 

- **Fresh Strawberry** 

###### **Each receiving record contains only one product type.** 

###### **Mixed-product baskets are not permitted.** 

## **2.8 Grade Selection** 

**The operator selects the grade.** 

###### **Examples:** 

- **Premium** 

- **Grade A** 

- **Grade B** 

- **Industrial** 

###### **Grades are configurable through the system settings.** 

## **2.9 Size Selection** 

**The operator selects the applicable size category.** 

###### **Examples:** 

- **+20 g** 

- **+14 g** 

- **10–20 g** 

- **Under 10 g** 

###### **Size definitions are configurable.** 

## **2.10 Basket Assignment** 

**Products are placed into reusable baskets.** 

**Each basket has a permanent QR code.** 

###### **Business Rules:** 

- **One basket contains only one product.** 

- **One basket contains only one grade.** 

- **One basket contains only one size category.** 

- **A basket can be reused after it becomes empty.** 

**No new QR code is generated for each receiving operation.** 

## **2.11 Basket QR** 

**Example:** 

**Basket QR** 

**BASKET-00154** 

**The QR identifies the physical basket, not the batch.** 

**The system associates the current receiving batch with the basket.** 

## **2.12 Weight Recording** 

**The basket is placed on the digital scale connected to the Raspberry Pi terminal.** 

**The operator confirms the measured weight.** 

**This weight becomes the official receiving weight.** 

**Supplier settlement is always based on this recorded weight.** 

## **2.13 Receiving Batch Creation** 

**After successful weighing, the system creates a Receiving Batch.** 

**The batch stores:** 

- **Supplier** 

- **Product** 

- **Grade** 

- **Size** 

- **Harvest Period** 

- **Receiving Weight** 

- **Receiving Date** 

- **Basket ID** 

- **Session ID** 

###### **This batch becomes the parent of all future production batches derived from it.** 

## **2.14 Label Printing** 

**If basket identification labels are used, the system prints the label immediately after batch creation.** 

###### **The label may include:** 

- **Basket QR** 

- **Product** 

- **Grade** 

- **Size** 

- **Batch Number** 

- **Receiving Date** 

**If labels are not required because baskets already have permanent QR codes, this step is skipped.** 

## **2.15 Cold Storage Transfer** 

**The operator moves the basket to the designated cold storage zone.** 

###### **The system records:** 

- **Destination Zone** 

- **Time** 

- **Operator** 

- **Movement Event** 

###### **The basket status changes to:** 

###### **Stored in Cold Storage** 

## **2.16 Receiving Completion** 

**After transfer, the receiving transaction is completed.** 

**Inventory is immediately updated.** 

**The basket becomes available for future production planning.** 

## **2.17 Multiple Baskets** 

**A supplier delivery may require multiple baskets.** 

**Example:** 

**Supplier** 

**↓** 

**120 kg Fresh Truffle** 

**↓** 

**Basket 1** 

###### **35 kg** 

###### **↓** 

**Basket 2** 

**40 kg** 

**↓** 

###### **Basket 3** 

**45 kg** 

###### **Each basket receives its own receiving batch record and inventory identity.** 

## **2.18 Receiving Validation Rules** 

###### **Before completing the transaction, the system validates:** 

- **Supplier selected.** 

- **Product selected.** 

- **Grade selected.** 

- **Size selected.** 

- **Basket assigned.** 

- **Basket not currently in use.** 

- **Weight greater than zero.** 

- **Session active.** 

###### **Validation failures prevent completion until corrected.** 

## **2.19 Receiving Warnings** 

**Certain conditions generate warnings rather than blocking the workflow.** 

###### **Examples:** 

- **Weight significantly outside the expected range.** 

- **Duplicate supplier delivery within a short period.** 

- **Basket approaching maintenance limit.** 

- **Receiving outside normal working hours.** 

###### **Warnings are logged for supervisor review.** 

## **2.20 Inventory Result** 

###### **After receiving, inventory contains:** 

- **Basket** 

- **Receiving Batch** 

- **Product** 

- **Grade** 

- **Size** 

- **Weight** 

- **Cold Storage Location** 

###### **No production processing has yet occurred.** 

## **2.21 Audit Trail** 

###### **The system records:** 

- **Session ID** 

- **Operator** 

- **Date and Time** 

- **Supplier** 

- **Basket** 

- **Weight** 

- **Product** 

- **Grade** 

- **Size** 

- **Harvest Period** 

- **Storage Location** 

###### **These records cannot be modified without authorization.** 

## **2.22 Exception Handling** 

###### **Examples of operational exceptions:** 

###### **Scale Failure** 

**The operator may switch to another configured Raspberry Pi terminal. The session remains active.** 

###### **Printer Out of Labels** 

**Receiving continues. The basket uses its permanent QR code, and the print request is added to the Pending Labels queue for later reprint if required.** 

###### **Session Interrupted** 

**The operator logs in again and resumes the active session.** 

###### **Wrong Basket Selected** 

**The operator may cancel the transaction before completion and select the correct basket.** 

## **2.23 End-to-End Example** 

###### **Farmer A arrives** 

###### **↓** 

**Receiving Session** 

###### **↓** 

**Select Supplier** 

**↓** 

###### **Select Product** 

###### **↓** 

###### **Grade A** 

###### **↓** 

###### **+20 g** 

###### **↓** 

###### **Scan Basket QR** 

###### **↓** 

###### **Weight = 34.8 kg** 

###### **↓** 

###### **Create Receiving Batch** 

###### **↓** 

###### **Move Basket to Cold Storage** 

**↓** 

###### **Receiving Complete** 

**Inventory now contains one active receiving batch ready for future sorting or processing.** 

## **2.24 Business Rules Summary** 

**● Every receiving operation belongs to an active Receiving Session.** 

- **Supplier selection is mandatory.** 

- **Harvest is recorded by Harvest Period rather than exact date.** 

- **Each basket contains only one product, one grade, and one size category.** 

- **Baskets use permanent QR codes and are reusable.** 

- **Receiving weight is the official weight for supplier settlement.** 

- **Every basket creates one receiving batch.** 

- **All receiving events are recorded in the audit log.** 

- **Validation errors block completion; operational warnings do not.** 

## **2.25 Workflow Summary** 

**The Receiving Workflow establishes the official entry point of every product into the factory.** 

**It creates the initial traceability records, updates inventory, links products to suppliers and harvest periods, and prepares baskets for storage and subsequent production operations. By combining session-based execution, controlled validation, reusable basket identification, and permanent audit logging, the workflow provides a reliable and consistent foundation for all downstream business processes.** 

## **2.3 Cold Storage Workflow** 

## **3.1 Purpose** 

**The Cold Storage Workflow manages all products stored between Receiving and the next production or shipping operation.** 

**The objectives are to:** 

- **Preserve product quality.** 

- **Maintain accurate inventory.** 

- **Track the physical location of every basket.** 

- **Recommend FIFO (First In, First Out).** 

- **Allow managers to override priorities when necessary.** 

- **Maintain complete traceability during storage.** 

**Cold Storage is the central inventory buffer of the factory.** 

## **3.2 Workflow Overview** 

###### **Receiving Complete** 

- **│** 

- 

###### **Assign Cold Storage Zone** 

- **│** 

- 

###### **Move Basket** 

- **│** 

- 

###### **Register Storage Location** 

**│** 

**▼** 

###### **Inventory Available** 

**│** 

**▼** 

###### **Production Planning** 

**│** 

**▼** 

###### **FIFO Recommendation** 

**│** 

**▼** 

###### **Manager Override (Optional)** 

**│** 

**▼** 

###### **Basket Selection** 

**│** 

**▼** 

###### **Scan Basket** 

**│** 

**▼** 

###### **Move to Next Process** 

## **3.3 Business Objectives** 

**Cold Storage is responsible for: ● Protecting product quality.** 

- **Organizing inventory.** 

- **Supporting production planning.** 

- **Preventing unnecessary product aging.** 

- **Providing immediate visibility of available stock.** 

**The workflow must support both automated recommendations and manual operational decisions.** 

## **3.4 Cold Storage Zones** 

**Cold Storage may consist of one or more configurable zones.** 

###### **Examples:** 

- **Zone A** 

- **Zone B** 

- **Export Holding** 

- **Processing Holding** 

- **Frozen Holding** 

**Each basket belongs to exactly one storage location at any time.** 

**Zones are configurable through the system settings.** 

## **3.5 Storage Registration** 

**When a basket enters Cold Storage, the system records:** 

- **Basket ID** 

- **Batch ID** 

- **Product** 

- **Grade** 

- **Size** 

- **Weight** 

- **Zone** 

- **Entry Time** 

- **Operator** 

###### **The basket status changes to:** 

**Stored** 

## **3.6 Inventory Visibility** 

**Every stored basket is immediately visible in inventory.** 

###### **Managers can search using:** 

- **Basket QR** 

- **Batch Number** 

- **Product** 

- **Grade** 

- **Size** 

- **Supplier** 

- **Harvest Period** 

- **Storage Zone** 

###### **Inventory is updated in real time.** 

## **3.7 FIFO Recommendation** 

**The system recommends baskets using FIFO.** 

**Priority is based primarily on:** 

- **Receiving Date** 

- **Storage Duration** 

###### **Older baskets receive higher priority.** 

**Example:** 

###### **Basket A** 

**Stored: 5 Days** 

###### **↓** 

**Basket B** 

**Stored: 3 Days** 

###### **↓** 

###### **Basket C** 

**Stored: Today** 

###### **Recommended order:** 

**A → B → C** 

## **3.8 Manager Priority Override** 

**FIFO is a recommendation, not a restriction.** 

**Managers may manually prioritize baskets for reasons such as:** 

- **Customer order requirements.** 

- **Quality considerations.** 

- **Product condition.** 

- **Production scheduling.** 

- **Machine availability.** 

- **Export deadlines.** 

###### **Overrides are fully logged.** 

## **3.9 Priority Levels** 

**Each basket may have one of the following priorities:** 

- **Normal** 

- **High** 

- **Urgent** 

**When priority is assigned, it takes precedence over FIFO recommendations.** 

## **3.10 Mobile Task Selection** 

**Operators using Android PDAs may work in two ways.** 

**Mode 1 — My Tasks** 

**The operator selects:** 

**My Tasks** 

**↓** 

**Cold Storage** 

**↓** 

**Move Basket** 

###### **The system displays the recommended basket.** 

###### **Mode 2 — QR Scan** 

**The operator scans a basket.** 

**The system immediately displays:** 

- **Basket Information** 

- **Current Status** 

- **Next Allowed Operation** 

###### **Example:** 

**Basket: BASKET-102** 

**Status:** 

###### **Stored** 

**Next Operation:** 

###### **Sorting** 

## **3.11 Basket Retrieval** 

**When production requests a basket:** 

###### **The operator:** 

- **Scans the basket.** 

- **Confirms retrieval.** 

- **Moves it physically.** 

- **Confirms destination.** 

###### **The system records the movement.** 

## **3.12 Storage Duration Monitoring** 

**The system continuously calculates storage duration.** 

###### **Examples:** 

- **1 Day** 

- **4 Days** 

- **8 Days** 

###### **Managers may sort inventory by storage duration.** 

## **3.13 Aging Warnings** 

**When storage exceeds configurable thresholds, warnings are generated.** 

###### **Example:** 

**Storage Duration** 

###### **10 Days** 

**Warning:** 

**Review Required** 

###### **Warnings do not block production.** 

## **3.14 Inventory Movements** 

**Every movement generates an inventory event.** 

**Example:** 

**Receiving** 

**↓** 

**Cold Storage** 

**↓** 

**Sorting** 

**↓** 

###### **Processing** 

###### **Movement history is never deleted.** 

## **3.15 Batch Integrity** 

###### **While in Cold Storage:** 

- **Product cannot change.** 

- **Grade cannot change.** 

- **Size cannot change.** 

###### **These changes are only permitted during Sorting.** 

## **3.16 Mixed Supplier Considerations** 

**At this stage:** 

**Each basket still represents a single Receiving Batch.** 

**Products from different suppliers remain physically separated.** 

**Mixing occurs later during Sorting or Processing.** 

## **3.17 Inventory Search** 

###### **Managers can search inventory using:** 

- **Product** 

- **Grade** 

- **Size** 

- **Supplier** 

- **Harvest Period** 

- **Zone** 

- **Basket QR** 

- **Batch Number** 

- **Weight Range** 

- **Storage Duration** 

**Search results update instantly.** 

## **3.18 Exception Handling** 

**Examples include:** 

###### **Basket Not Found** 

**Operator scans an empty location.** 

**System creates an exception requiring supervisor review.** 

###### **Wrong Zone** 

**Basket found in a different zone than expected.** 

**System records a location discrepancy.** 

###### **Basket Damaged** 

**Operator marks basket as damaged.** 

**Product is transferred to another basket.** 

**The new basket becomes the active container while preserving batch history.** 

###### **Emergency Removal** 

**Manager may remove a basket immediately.** 

**Reason is recorded in the audit log.** 

## **3.19 Audit Trail** 

###### **Every Cold Storage event records:** 

- **Basket** 

- **Batch** 

- **Zone** 

- **Operator** 

- **Session** 

- **Date** 

- **Time** 

- **Previous Location** 

- **New Location** 

- **Movement Reason** 

###### **These records are permanent.** 

## **3.20 Business Rules** 

- **Every basket must belong to one storage location.** 

- **Every movement requires QR confirmation.** 

- **FIFO is the default recommendation.** 

- **Managers may override FIFO at any time.** 

- **Priority overrides are audited.** 

- **One basket contains one product, one grade, and one size.** 

- **Mixing is not permitted inside Cold Storage.** 

- **Inventory updates immediately after every movement.** 

- **Storage duration is calculated automatically.** 

- **Aging warnings do not prevent operations.** 

## **3.21 End-to-End Example** 

###### **Receiving Completed** 

###### **↓** 

###### **Basket BASKET-054** 

###### **↓** 

###### **Cold Storage Zone A** 

###### **↓** 

###### **Stored for 4 Days** 

###### **↓** 

###### **Manager Marks as High Priority** 

###### **↓** 

###### **Operator Opens My Tasks** 

###### **↓** 

###### **System Recommends BASKET-054** 

###### **↓** 

###### **Operator Scans Basket** 

**↓** 

###### **Destination:** 

###### **Sorting** 

###### **↓** 

###### **Inventory Updated** 

###### **↓** 

###### **Cold Storage Complete** 

## **3.22 Workflow Summary** 

**The Cold Storage Workflow provides controlled inventory management between Receiving and Production.** 

**It combines real-time inventory visibility, FIFO-based recommendations, configurable manager priorities, QR-driven basket handling, and complete movement auditing. By preserving batch integrity during storage while allowing flexible production planning, Cold Storage serves as the operational buffer that connects inbound receiving with downstream manufacturing processes.** 

## **4 Sorting Workflow** 

## **4.1 Purpose** 

**The Sorting Workflow transforms received products into standardized production batches suitable for fresh export or further processing.** 

**Sorting is one of the most important operations in the factory because it is the first stage where products may be:** 

- **Reclassified** 

- **Split into multiple batches** 

- **Merged with other batches** 

- **Assigned to different production destinations** 

**Unlike Receiving, where each basket represents a single supplier batch, Sorting is the stage where controlled batch mixing is permitted.** 

## **4.2 Business Objectives** 

**The objectives of Sorting are:** 

- **Standardize product quality.** 

- **Standardize product size.** 

- **Separate export-quality products from processing products.** 

- **Create production-ready batches.** 

- **Support controlled mixing of products.** 

- **Preserve complete traceability.** 

## **4.3 Workflow Overview** 

###### **Select Sorting Session** 

- **│** 

- 

###### **Receive Task / Scan Basket** 

**│** 

**▼** 

###### **Retrieve Basket from Cold Storage** 

**│** 

**▼** 

###### **Sort Product** 



<!-- Start of picture text -->
│<br>├──────────────┬──────────────┐<br>▼ ▼ ▼<br>Premium         Standard       Industrial<br>│ │ │<br>▼ ▼ ▼<br><!-- End of picture text -->

###### **Create New Production Batches** 

**│** 

**▼** 

###### **Merge (Optional)** 

**│** 

**▼** 

###### **Assign Destination** 

**│** 

**▼** 

###### **Move to Next Zone** 

**│** 

**▼** 

###### **Complete Sorting Session** 

## **4.4 Starting the Workflow** 

**The operator logs into the Android PDA or Raspberry Pi terminal and selects the Sorting role.** 

**The operator may begin in one of two ways:** 

###### **Method 1 – My Tasks** 

**The system recommends the next basket according to:** 

- **FIFO** 

- **Manager Priority** 

- **Production Planning** 

###### **Method 2 – QR Scan** 

**The operator scans a basket QR.** 

**The system verifies that the basket is eligible for sorting.** 

## **4.5 Basket Validation** 

###### **Before sorting begins, the system validates:** 

- **Basket exists.** 

- **Basket is currently in Cold Storage.** 

- **Basket is not locked.** 

- **Basket is not already assigned to another active session.** 

- **Product status allows sorting.** 

###### **If validation fails, the workflow cannot continue.** 

## **4.6 Opening a Sorting Session** 

**Every sorting activity belongs to a Sorting Session.** 

###### **The session records:** 

- **Operator** 

- **Terminal** 

- **Start Time** 

- **End Time** 

- **Baskets Processed** 

- **Production Batches Created** 

###### **If interrupted, the session can be resumed later.** 

## **4.7 Physical Sorting** 

**Products are physically separated according to configurable business rules.** 

###### **Typical criteria include:** 

- **Size** 

- **Appearance** 

- **Shape** 

- **Damage** 

- **Export suitability** 

- **Processing suitability** 

###### **The system does not determine grades; it records the decisions made by the operator according to factory standards.** 

## **4.8 Creating Production Batches** 

**Sorting produces one or more Production Batches.** 

**Example:** 

**Receiving Batch** 

**40 kg** 

**↓** 

###### **Sorting** 

###### **↓** 

###### **Premium** 

**15 kg** 

###### **↓** 

**Grade A** 

**18 kg** 

###### **↓** 

###### **Industrial** 

###### **7 kg** 

###### **Each output becomes an independent Production Batch.** 

## **4.9 Batch Splitting** 

**One Receiving Batch may generate multiple Production Batches.** 

**Example:** 

**Receiving Batch RB-001** 

**↓** 

**PB-101** 

**PB-102** 

**PB-103** 

###### **The genealogy remains permanently linked.** 

## **4.10 Batch Merging** 

**Multiple Receiving Batches may be merged.** 

**Example:** 

**RB-001** 

**+** 

**RB-002** 

**+** 

**RB-003** 

**↓** 

**PB-201** 

**The new Production Batch stores references to all parent batches.** 

**Supplier contributions remain traceable.** 

## **4.11 Controlled Mixing** 

**Controlled mixing is a normal business practice.** 

**Examples include:** 

- **Combining products from multiple suppliers.** 

- **Combining products received on different days.** 

- **Combining products from the same Harvest Period.** 

**Mixing is fully recorded in the genealogy.** 

## **4.12 Harvest Period Handling** 

**Even after merging, the system retains the Harvest Period of every parent batch.** 

**If multiple Harvest Periods are combined, the Production Batch stores all contributing periods.** 

**This ensures traceability without requiring exact harvest dates.** 

## **4.13 Destination Assignment** 

**Each Production Batch receives one destination.** 

###### **Possible destinations:** 

- **Fresh Export** 

- **Washing** 

- **Freezing** 

- **Freeze Drying** 

- **Conventional Drying** 

**The destination determines the next operational task.** 

## **4.14 Basket Assignment** 

**After sorting, each Production Batch is placed into a basket.** 

**Business Rules:** 

- **One basket contains one Production Batch.** 

- **One basket contains one product.** 

- **One basket contains one grade.** 

- **One basket contains one size category.** 

**The basket QR remains unchanged.** 

**Only the batch associated with the basket changes.** 

## **4.15 Weight Recording** 

**Each new Production Batch is weighed.** 

**This weight becomes the official production input weight for downstream processing.** 

**Minor differences from Receiving Weight are expected due to sorting and cleaning.** 

## **4.16 Inventory Update** 

**When sorting is completed:** 

**The original Receiving Batch status changes to:** 

**Consumed** 

**New Production Batches become:** 

**Available** 

**Inventory immediately reflects the new baskets.** 

## **4.17 Task Generation** 

**After destination assignment, the system automatically generates the next operational task.** 

###### **Examples:** 

###### **Production Batch** 

###### **↓** 

###### **Destination** 

###### **↓** 

###### **Freeze Dry** 

###### **↓** 

**Create Task:** 

###### **Load Freeze Dryer** 

## **4.18 Exception Handling** 

**Examples include:** 

###### **Basket Contains Wrong Product** 

###### **Sorting stops until corrected.** 

###### **Weight Difference** 

###### **If the sorted weight differs significantly from the receiving weight:** 

- **A warning is displayed.** 

- **The batch is flagged.** 

- **Production continues.** 

###### **Empty Basket** 

**The operator may close the basket.** 

###### **The batch status becomes:** 

###### **Consumed** 

###### **Manager Override** 

###### **Managers may manually change:** 

- **Destination** 

- **Priority** 

- **Grade** 

###### **All overrides are recorded.** 

## **4.19 Audit Trail** 

**Every sorting event records:** 

- **Session** 

- **Operator** 

- **Input Basket** 

- **Parent Receiving Batch(es)** 

- **Output Production Batch(es)** 

- **Output Weight** 

- **Grade** 

- **Size** 

- **Destination** 

- **Date** 

- **Time** 

###### **These records form the foundation of downstream traceability.** 

## **4.20 Business Rules** 

- **Every sorting activity belongs to a Sorting Session.** 

- **A basket must be validated before sorting.** 

- **One Receiving Batch may produce multiple Production Batches.** 

- **Multiple Receiving Batches may be merged into one Production Batch.** 

- **Controlled mixing is permitted and fully traceable.** 

- **Each output basket contains one product, one grade, and one size category.** 

- **Each Production Batch receives exactly one destination.** 

- **Output batches are weighed before completion.** 

- **Weight anomalies generate warnings rather than blocking production.** 

- **All genealogy links between parent and child batches are permanently preserved.** 

## **4.21 End-to-End Example** 

**Receiving Batch RB-001** 

**35 kg** 

**+** 

**Receiving Batch RB-002** 

**20 kg** 

**↓** 

###### **Sorting** 

###### **↓** 

###### **Premium Batch PB-501** 

###### **18 kg** 

###### **Destination:** 

**Fresh Export** 

###### **↓** 

###### **Grade A Batch PB-502** 

###### **27 kg** 

###### **Destination:** 

###### **Freeze Drying** 

###### **↓** 

###### **Industrial Batch PB-503** 

**10 kg** 

**Destination:** 

**Conventional Drying** 

###### **↓** 

###### **Inventory Updated** 

###### **↓** 

###### **Tasks Generated** 

###### **↓** 

###### **Sorting Complete** 

## **4.22 Workflow Summary** 

**The Sorting Workflow converts incoming receiving batches into standardized production batches while preserving complete traceability.** 

**It supports batch splitting, controlled merging, configurable grading, destination assignment, and automatic task generation. By allowing real-world production practices such as combining products from multiple suppliers or receiving days— while maintaining full genealogy—the workflow provides the operational flexibility required by the factory without compromising inventory accuracy or traceability.** 

## **5 Washing Workflow** 

## **5.1 Purpose** 

**The Washing Workflow manages the cleaning of production batches before further processing.** 

###### **Its objectives are to:** 

- **Prepare products for processing.** 

- **Remove soil and foreign materials.** 

- **Preserve traceability.** 

- **Maintain inventory accuracy.** 

- **Generate the next production task.** 

**Washing is an operational process only. It does not change product ownership, batch genealogy, grade, or size.** 

## **5.2 Workflow Overview** 

###### **Sorting Complete** 

- **│** 

- 

###### **Create Washing Task** 

- **│** 

- 

###### **Operator Accepts Task** 

- **│** 

- 

###### **Retrieve Basket** 

- **│** 

**▼** 

###### **Scan Basket QR** 

**│** 

**▼** 

###### **Wash Product** 

**│** 

**▼** 

###### **Return Product to Basket** 

**│** 

**▼** 

###### **Move to Next Zone** 

**│** 

**▼** 

###### **Complete Washing Session** 

## **5.3 Business Objectives** 

**The Washing Workflow ensures that products are properly cleaned before entering slicing, freezing, or other downstream production processes.** 

**The system records that washing occurred, but it does not manage the washing method, duration, or equipment settings.** 

## **5.4 Starting the Workflow** 

**The operator logs into an Android PDA or Raspberry Pi terminal.** 

**Role:** 

###### **Washing Operator** 

###### **The operator begins by:** 

###### **Method 1** 

###### **Opening My Tasks** 

###### **or** 

###### **Method 2** 

###### **Scanning the basket QR.** 

## **5.5 Basket Validation** 

###### **Before washing begins the system validates:** 

- **Basket exists.** 

- **Basket status = Ready for Washing.** 

- **Basket is not locked.** 

- **Basket is not already being processed.** 

- **Basket belongs to an active production batch.** 

###### **If validation fails the operation cannot start.** 

## **5.6 Washing Session** 

**Every washing activity belongs to a Washing Session.** 

###### **Session information:** 

- **Operator** 

- **Device** 

- **Start Time** 

- **End Time** 

- **Basket** 

- **Production Batch** 

###### **Interrupted sessions may later be resumed.** 

## **5.7 Washing Operation** 

**The operator removes the basket contents.** 

**The products are washed according to factory procedures.** 

###### **After washing:** 

- **Products are returned to the basket.** 

- **No batch changes occur.** 

- **No grade changes occur.** 

- **No size changes occur.** 

## **5.8 Batch Integrity** 

**During washing the following remain unchanged:** 

- **Product** 

- **Production Batch** 

- **Grade** 

- **Size** 

- **Harvest Period** 

- **Supplier Contribution** 

###### **Washing is not allowed to split or merge batches.** 

## **5.9 Weight Handling** 

**No mandatory weighing is performed after washing.** 

**Business experience shows that washed products—particularly fresh truffles—may gain weight due to absorbed surface moisture.** 

###### **Therefore:** 

- **Washing weight is not considered an official inventory weight.** 

- **Inventory quantity remains unchanged.** 

- **Weight differences are expected.** 

**If an optional weight is recorded for operational purposes, it is stored only as an informational value and does not affect inventory balances.** 

## **5.10 Quality Inspection** 

**The operator may report quality observations.** 

###### **Examples:** 

- **Excessive damage** 

- **Rotten product** 

- **Foreign material** 

- **Abnormal appearance** 

**Quality observations create flags for supervisors.** 

**They do not automatically stop production.** 

## **5.11 Destination Determination** 

**After washing the batch moves to its assigned destination.** 

###### **Examples:** 

- **Slicing** 

- **Freezing** 

- **Packaging (if applicable)** 

**The destination was determined during Sorting and normally does not change.** 

**Managers may override the destination if required.** 

## **5.12 Inventory Update** 

**When washing is completed:** 

**Current Status:** 

**Ready for Washing** 

###### **becomes** 

###### **Washed** 

###### **The basket location is updated to the next operational zone.** 

## **5.13 Task Generation** 

**Completion of washing automatically creates the next task.** 

**Example:** 

**Washed** 

###### **↓** 

###### **Next Destination** 

###### **↓** 

###### **Slicing** 

###### **↓** 

###### **Create Task** 

###### **Slice Production Batch PB-201** 

## **5.14 Manager Priority** 

**Managers may change production priorities.** 

**Example:** 

**A washed basket may be marked:** 

- **High Priority** 

- **Urgent** 

**The next operator immediately sees the updated task order.** 

## **5.15 Exception Handling** 

**Examples include:** 

###### **Basket Not Found** 

**Operator cannot locate the assigned basket.** 

**Exception created.** 

**Supervisor review required.** 

###### **Washing Delayed** 

**Basket remains in Washing status longer than the configured threshold. Warning generated.** 

###### **Damaged Basket** 

**Products are transferred into another basket.** 

**The new basket becomes the active container.** 

**Complete history is preserved.** 

###### **Quality Issue** 

###### **Operator reports product quality concerns.** 

**System creates a management flag.** 

###### **Processing may continue unless management intervenes.** 

## **5.16 Audit Trail** 

###### **Every washing operation records:** 

- **Session ID** 

- **Operator** 

- **Device** 

- **Basket** 

- **Production Batch** 

- **Start Time** 

- **Completion Time** 

- **Previous Status** 

- **New Status** 

- **Destination** 

- **Quality Flags** 

- **Manager Overrides** 

###### **All records are permanent.** 

## **5.17 Business Rules** 

- **Every washing operation belongs to a Washing Session.** 

- **Only baskets in Ready for Washing status may be processed.** 

- **Washing does not change the production batch.** 

- **Washing does not split or merge batches.** 

- **Washing does not modify grade or size.** 

- **Washing does not create a new batch.** 

- **Official inventory weight is not recalculated after washing.** 

- **Optional washing weights do not affect inventory.** 

- **Quality issues generate warnings, not automatic production stops.** 

- **Completion of washing automatically generates the next operational task.** 

## **5.18 End-to-End Example** 

**Production Batch PB-302** 

###### **↓** 

###### **Status:** 

**Ready for Washing** 

###### **↓** 

###### **Operator Opens My Tasks** 

###### **↓** 

###### **Retrieve Basket** 

###### **↓** 

###### **Scan Basket QR** 

###### **↓** 

###### **Wash Product** 

**↓** 

###### **Return Product to Basket** 

###### **↓** 

###### **Status:** 

###### **Washed** 

###### **↓** 

###### **Destination:** 

###### **Slicing** 

###### **↓** 

###### **Create Slicing Task** 

###### **↓** 

###### **Inventory Updated** 

## **5.19 Workflow Summary** 

**The Washing Workflow prepares production batches for downstream processing while preserving complete batch integrity and traceability.** 

**Unlike Receiving or Sorting, washing is a non-transformational process: it cleans the product but does not alter its identity, genealogy, or inventory structure. The workflow supports real-world manufacturing conditions by allowing expected moisture-related weight changes, recording quality observations, and automatically advancing production through task generation and inventory updates.** 

## **6 Slicing Workflow** 

## **6.1 Purpose** 

**The Slicing Workflow prepares washed production batches for freezing and freeze drying by cutting products into standardized slices.** 

###### **The objectives are to:** 

- **Produce uniform slices.** 

- **Prepare products for efficient freezing and freeze drying.** 

- **Preserve batch traceability.** 

- **Record production yield.** 

- **Generate the next production task.** 

**Slicing changes only the physical form of the product. It does not change ownership, genealogy, or batch identity.** 

## **6.2 Workflow Overview** 

###### **Washing Complete** 

- **│** 

- 

###### **Create Slicing Task** 

- **│** 

- 

###### **Operator Accepts Task** 

- **│** 

- 

###### **Retrieve Basket** 

- **│** 

**▼** 

###### **Scan Basket QR** 

**│** 

**▼** 

###### **Slice Product** 

**│** 

**▼** 

###### **Load Product into Trays** 

**│** 

**▼** 

###### **Register Tray Allocation** 

**│** 

**▼** 

###### **Move Trays to Freezing** 

**│** 

**▼** 

###### **Complete Slicing Session** 

## **6.3 Business Objectives** 

**Slicing standardizes product dimensions before freezing. The workflow must:** 

- **Maintain complete batch identity.** 

- **Record tray allocation.** 

- **Support loading across multiple trays.** 

- **Prepare products for the next production stage.** 

## **6.4 Starting the Workflow** 

**The operator logs in using:** 

- **Android PDA** 

- **● Raspberry Pi Terminal** 

**Role:** 

**Slicing Operator** 

**The workflow starts from:** 

###### **Method 1** 

**My Tasks** 

**or** 

###### **Method 2** 

**Scanning the basket QR.** 

## **6.5 Basket Validation** 

**Before slicing begins, the system verifies:** 

- **Basket exists.** 

- **Basket status = Washed.** 

- **Basket is assigned to Slicing.** 

- **Basket is not locked.** 

- **Basket is not already in another active session.** 

**Only validated baskets may be processed.** 

## **6.6 Slicing Session** 

**Every slicing operation belongs to a Slicing Session.** 

###### **The session records:** 

- **Operator** 

- **Device** 

- **Basket** 

- **Production Batch** 

- **Start Time** 

- **End Time** 

###### **The session may be paused and resumed if necessary.** 

## **6.7 Slicing Operation** 

**The operator slices the product according to factory standards.** 

**Typical parameters (configured outside the workflow) include:** 

- **Slice thickness** 

- **Cutting method** 

- **Product orientation** 

**Example:** 

**Black Truffle** 

###### **↓** 

**2 mm slices** 

**The workflow records completion only; machine settings are not managed by the system.** 

## **6.8 Batch Integrity** 

**Slicing does not create a new production batch.** 

**The following remain unchanged:** 

- **Product** 

- **Production Batch** 

- **Grade** 

- **Harvest Period** 

###### **● Supplier Contribution** 

**The production batch continues through the remaining production stages.** 

## **6.9 Tray Allocation** 

**After slicing, products are distributed across freeze-dryer trays.** 

**The system records:** 

- **Tray Number** 

- **Production Batch** 

- **Quantity (optional)** 

- **Tray Sequence** 

###### **Example:** 

###### **Batch PB-420** 

###### **↓** 

**Tray 01** 

###### **↓** 

**Tray 02** 

###### **↓** 

**Tray 03** 

**↓** 

**Tray 04** 

**A production batch may occupy one or many trays.** 

**Likewise, depending on operational configuration, multiple production batches may later share the same freeze-drying cycle while remaining on separate trays.** 

## **6.10 Tray Identification** 

**Each tray receives a unique operational identity.** 

**Example:** 

**Tray** 

**TRAY-0142** 

**Tray identifiers are used internally for production tracking.** 

**Permanent labels are optional and depend on factory procedures.** 

## **6.11 Weight Handling** 

**No mandatory weighing is performed after slicing.** 

**Small material losses are considered normal.** 

**Optional operational weights may be recorded for production analysis but do not replace official inventory weights.** 

## **6.12 Destination** 

###### **After tray loading, the destination becomes:** 

###### **Freezing** 

**The system automatically prepares the next operational task.** 

## **6.13 Inventory Update** 

**Basket Status:** 

**Washed** 

###### **changes to** 

**Sliced** 

**Tray inventory becomes active.** 

**The basket may now become empty and available for reuse after confirmation by the operator.** 

## **6.14 Basket Release** 

**When all products have been transferred to trays:** 

- **The basket is marked Empty.** 

- **The basket becomes available for future receiving or production activities.** 

- **Tray records become the active physical containers until the freeze-drying cycle is completed.** 

## **6.15 Task Generation** 

**Completion automatically creates the next task.** 

**Example:** 

###### **Sliced Trays** 

###### **↓** 

###### **Freezing** 

###### **↓** 

###### **Create Task** 

###### **Load Freezer** 

## **6.16 Exception Handling** 

###### **Basket Empty** 

**Operator accidentally starts slicing with an empty basket. Session cannot continue.** 

###### **Tray Capacity Exceeded** 

**The selected tray exceeds the configured maximum capacity.** 

**The system displays a warning.** 

**The operator may redistribute the product before completion.** 

###### **Damaged Tray** 

###### **The operator transfers the product to another tray.** 

**The tray assignment history is preserved.** 

###### **Interrupted Session** 

**The operator resumes the slicing session later.** 

**All completed tray assignments remain saved.** 

## **6.17 Audit Trail** 

**Every slicing operation records:** 

- **Session** 

- **Operator** 

- **Device** 

- **Basket** 

- **Production Batch** 

- **Tray Assignments** 

- **Start Time** 

- **End Time** 

- **Destination** 

- **Exceptions** 

- **Manager Overrides** 

###### **All records are retained permanently.** 

## **6.18 Business Rules** 

- **Every slicing operation belongs to a Slicing Session.** 

- **Only baskets in Washed status may be sliced.** 

- **Slicing does not create a new production batch.** 

- **Slicing does not split or merge batches.** 

- **Batch genealogy remains unchanged.** 

- **Products are transferred from baskets to trays.** 

- **One production batch may occupy multiple trays.** 

- **Tray assignments are fully traceable.** 

- **Official inventory weight is not recalculated after slicing.** 

- **Completion automatically generates the Freezing task.** 

- **Empty baskets become available for reuse after confirmation.** 

## **6.19 End-to-End Example** 

**Production Batch PB-420** 

###### **↓** 

###### **Status:** 

###### **Washed** 

###### **↓** 

###### **Operator Opens My Tasks** 

###### **↓** 

###### **Retrieve Basket** 

###### **↓** 

###### **Scan Basket QR** 

###### **↓** 

###### **Slice Product** 

###### **↓** 

###### **Load Product** 

###### **↓** 

**Tray-01** 

**Tray-02 Tray-03** 

###### **↓** 

###### **Basket Released** 

###### **↓** 

###### **Status:** 

###### **Sliced** 

###### **↓** 

###### **Create Freezing Task** 

**↓** 

###### **Inventory Updated** 

## **6.20 Workflow Summary** 

**The Slicing Workflow converts washed products into standardized slices ready for freezing while preserving complete production batch identity and traceability.** 

**The workflow introduces tray-level tracking, transitions the physical container from baskets to trays, automatically releases reusable baskets, and prepares production batches for the freezing stage. By separating physical container tracking from batch genealogy, the workflow supports efficient production without compromising inventory accuracy or traceability.** 

## **7 Fresh Export Workflow** 

## **7.1 Purpose** 

**The Fresh Export Workflow manages the preparation and shipment of fresh products without undergoing industrial processing.** 

###### **Its objectives are to:** 

- **Prepare products for export.** 

- **Preserve freshness and quality.** 

- **Maintain complete traceability.** 

- **Build shipping units.** 

- **Prepare export documentation.** 

###### **Unlike the processing workflow, fresh export products do not pass through freezing, freeze drying, or conventional drying.** 

## **7.2 Workflow Overview** 

###### **Sorting Complete** 

- **│** 

- 

###### **Destination = Fresh Export** 

- **│** 

- 

###### **Create Fresh Export Task** 

- **│** 

- 

###### **Retrieve Basket** 

- **│** 

**▼** 

###### **Scan Basket** 

**│** 

**▼** 

###### **Pack into Nets** 

**│** 

**▼** 

###### **Scan Nets into Shipping Box** 

**│** 

**▼** 

###### **Print Shipping Box Label** 

**│** 

**▼** 

###### **Cold Storage / Dispatch Area** 

**│** 

**▼** 

###### **Shipment** 

## **7.3 Business Objectives** 

**Fresh export operations focus on minimizing handling time while maintaining product quality.** 

###### **The workflow must:** 

- **Preserve product freshness.** 

- **Support mixed product combinations within shipping boxes.** 

- **Maintain shipment traceability.** 

- **Record packaging relationships.** 

## **7.4 Starting the Workflow** 

**The operator logs in.** 

**Role:** 

**Fresh Export Operator** 

**The workflow begins through:** 

###### **Method 1** 

**My Tasks** 

**or** 

###### **Method 2** 

**Scanning a basket QR.** 

## **7.5 Basket Validation** 

**Before packing begins, the system validates:** 

- **Basket exists.** 

- **Destination = Fresh Export.** 

- **Basket is available.** 

- **Basket is not locked.** 

- **Basket is not already assigned to another session.** 

## **7.6 Fresh Export Session** 

**Each operation belongs to a Fresh Export Session.** 

**The session records:** 

- **Operator** 

- **● Device** 

- **Basket** 

- **Production Batch** 

- **● Start Time** 

- **End Time** 

## **7.7 Packing into Nets** 

**Fresh products are packed into nets according to customer or commercial requirements.** 

###### **Examples:** 

- **250 g** 

- **500 g** 

- **1 kg** 

- **5 kg** 

- **7 kg** 

**Net sizes are configurable.** 

## **7.8 Net Identification** 

**Individual nets do not receive labels or QR codes.** 

**The system does not track each net separately.** 

**Instead, it records the number and weight of nets produced from each production batch.** 

**Example:** 

**Production Batch PB-520** 

**↓** 

**7 Nets** 

**↓** 

**Each 5 kg** 

## **7.9 Partial Production** 

**If a production batch cannot produce a complete net:** 

**Example:** 

**Remaining Product:** 

**3 kg** 

**Required Net:** 

###### **5 kg** 

**The remaining product stays in the basket and waits for additional compatible product from future sorting operations.** 

**This controlled mixing is an accepted business practice.** 

**The genealogy of all contributing batches is preserved.** 

## **7.10 Shipping Box Assembly** 

**After net preparation, nets are packed into insulated shipping boxes (EPS boxes).** 

**The operator scans the production batch (or basket) as nets are placed into each shipping box.** 

**The system records:** 

- **Shipping Box ID** 

- **Production Batch(es)** 

- **Number of Nets** 

- **Total Weight** 

**Since nets are not individually identified, traceability is maintained at the production batch level.** 

## **7.11 Mixed Contents** 

**One shipping box may contain:** 

- **Multiple production batches.** 

- **Multiple grades.** 

- **Multiple size categories.** 

**Example:** 

**EPS Box** 

**↓** 

###### **Net** 

**Premium** 

**↓** 

###### **Net** 

**Grade A** 

**↓** 

**Net** 

**Industrial** 

###### **All contents are recorded.** 

## **7.12 Shipping Box Label** 

**After the operator confirms the contents, the system prints a shipping box label.** 

**Typical information includes:** 

- **Shipping Box QR** 

- **Shipment Number** 

- **Destination** 

- **Total Weight** 

- **Number of Nets** 

###### **If printing fails, the box enters the Pending Label Queue.** 

## **7.13 Reprint** 

**Supervisors may reprint labels at any time.** 

**To prevent incorrect label placement, the operator must first scan the Shipping Box QR (temporary ID or system-generated identifier) before printing.** 

**Every reprint is logged.** 

## **7.14 Cold Holding** 

**Completed shipping boxes are moved to the export holding cold room.** 

**The system records:** 

- **Location** 

- **Time** 

- **Operator** 

###### **Status becomes:** 

###### **Ready for Shipment** 

## **7.15 Shipment Assignment** 

**When a shipment is created, shipping boxes are assigned.** 

**One shipment may contain:** 

- **Multiple shipping boxes.** 

- **Multiple products.** 

- **Multiple grades.** 

**Shipment creation does not modify production batches.** 

## **7.16 Inventory Update** 

**After packaging:** 

**The production batch status changes to:** 

**Packed for Export** 

**Inventory now tracks the shipping box rather than the original basket.** 

**If product remains in the basket, that basket stays active until completely consumed.** 

## **7.17 Weight Handling** 

**Official weights are recorded:** 

- **During Sorting.** 

- **During Shipping Box preparation.** 

**Individual net weights are considered operational values and are not independently tracked.** 

## **7.18 Exception Handling** 

###### **Remaining Product** 

**Incomplete net.** 

**Product remains in inventory.** 

###### **Shipping Box Full** 

**Operator starts a new shipping box.** 

###### **Printer Failure** 

**Box enters the Pending Label Queue.** 

**Shipment may continue after label reprint.** 

###### **Wrong Product Added** 

**Operator removes the production batch before final confirmation.** 

###### **Manager Override** 

###### **Managers may:** 

- **Change shipment priority.** 

- **Split shipping boxes.** 

- **Merge shipment contents.** 

**All actions are audited.** 

## **7.19 Audit Trail** 

**The system records:** 

- **Session** 

- **Operator** 

- **Production Batch** 

- **Basket** 

- **Number of Nets** 

- **Shipping Box** 

- **Shipment** 

- **Weight** 

- **Start Time** 

- **Completion Time** 

- **Reprints** 

- **Overrides** 

## **7.20 Business Rules** 

- **Every Fresh Export operation belongs to a Fresh Export Session.** 

- **Only production batches with destination Fresh Export may be processed.** 

- **Nets are not individually labeled.** 

- **Nets are not individually traceable.** 

- **Traceability is maintained at the production batch level.** 

- **Remaining products may be mixed with future compatible batches.** 

- **Shipping boxes may contain multiple grades and multiple production batches.** 

- **Shipping box labels are printed only after completion.** 

- **Failed label printing creates a Pending Label entry.** 

- **Every reprint is logged.** 

- **Shipment creation does not modify genealogy.** 

## **7.21 End-to-End Example** 

**Production Batch PB-520** 

###### **↓** 

**Fresh Export** 

**↓** 

###### **Operator Retrieves Basket** 

###### **↓** 

###### **Pack into 6 Nets** 

###### **↓** 

###### **1 kg Remaining** 

###### **↓** 

###### **Remaining Returned to Basket** 

###### **↓** 

###### **6 Nets Packed into EPS Box** 

###### **↓** 

###### **Print Shipping Box Label** 

###### **↓** 

###### **Move to Export Cold Room** 

###### **↓** 

###### **Assign to Shipment** 

###### **↓** 

###### **Ready for Dispatch** 

## **7.22 Workflow Summary** 

**The Fresh Export Workflow prepares fresh products for shipment while minimizing handling and preserving product quality.** 

**By tracking production batches rather than individual nets, supporting controlled mixing of remaining quantities, and maintaining complete relationships between production batches, shipping boxes, and shipments, the workflow balances operational simplicity with robust traceability. It also integrates label management, shipment preparation, and inventory updates to support efficient export operations.** 

## **8 Freezing Workflow** 

## **8.1 Purpose** 

**The Freezing Workflow manages the freezing of sliced production batches before Freeze Drying.** 

**The objectives are to:** 

- **Preserve product quality.** 

- **Prepare products for freeze drying.** 

- **Record freezer loading operations.** 

- **Maintain complete traceability.** 

- **Support multiple production batches within one freezing cycle.** 

**The workflow does not change product ownership, genealogy, or inventory quantities.** 

## **8.2 Business Objectives** 

**Freezing is an intermediate production stage.** 

**It transforms the product from Fresh Sliced to Frozen, making it ready for Freeze Drying.** 

**The workflow records:** 

- **Which trays entered the freezer.** 

- **Which freezing cycle they belong to.** 

- **When freezing started and finished.** 

- **Who performed the operation.** 

## **8.3 Workflow Overview** 

**Slicing Completed** 

- **│** 

**▼** 

###### **Create Freezing Task** 

**│** 

**▼** 

###### **Operator Accepts Task** 

**│** 

**▼** 

###### **Retrieve Trays** 

**│** 

**▼** 

###### **Scan Tray QR** 

**│** 

**▼** 

###### **Create Freezing Cycle** 

**│** 

**▼** 

###### **Load Freezer** 

**│** 

**▼** 

###### **Start Freezing** 

**│** 

**▼** 

###### **Complete Freezing** 

**│** 

**▼** 

###### **Move to Freeze Dryer Queue** 

## **8.4 Starting the Workflow** 

**The operator logs into:** 

- **Android PDA** 

- **● Raspberry Pi Terminal** 

**Role:** 

**Freezing Operator** 

###### **The workflow starts from:** 

- **My Tasks** 

###### **or** 

- **Tray QR Scan** 

## **8.5 Tray Validation** 

**Before loading the freezer the system validates:** 

- **Tray exists.** 

- **Tray status = Sliced.** 

- **Tray is not already frozen.** 

- **Tray is not assigned to another active cycle.** 

- **Tray is available.** 

###### **Only validated trays may enter a freezing cycle.** 

## **8.6 Freezing Session** 

**Every freezing activity belongs to a Freezing Session. The session records:** 

- **Operator** 

- **Device** 

- **Freezer** 

- **Start Time** 

- **Completion Time** 

- **Trays Loaded** 

- **Freezing Cycle** 

## **8.7 Freezing Cycle** 

**A Freezing Cycle represents one complete freezer operation. Example:** 

**Freezing Cycle** 

**FC-20260715-01** 

**The cycle groups all trays frozen together.** 

**The cycle is independent of production batches.** 

## **8.8 Loading the Freezer** 

**The operator scans every tray before loading.** 

**Example:** 

**Tray-001** 

**↓** 

**Tray-002** 

**↓** 

**Tray-003** 

**↓** 

**Start Cycle** 

###### **The system stores the loading sequence.** 

## **8.9 Multiple Production Batches** 

**One freezing cycle may contain trays from multiple production batches.** 

**Example:** 

**Freezing Cycle FC-101** 

**↓** 

**Tray 01** 

**PB-420** 

**↓** 

**Tray 02 PB-421** 

**↓** 

**Tray 03** 

**PB-422** 

**Batch genealogy remains unchanged.** 

## **8.10 Tray Integrity** 

**Each tray always belongs to one Production Batch.** 

**A tray cannot contain products from multiple batches.** 

**This preserves physical traceability throughout freezing and freeze drying.** 

## **8.11 Freezing Completion** 

**When freezing is complete:** 

**Tray Status changes from:** 

**Sliced to Frozen** 

**The freezing cycle is closed.** 

## **8.12 Queue for Freeze Dryer** 

**After freezing, trays are moved to the Freeze Dryer staging area.** 

**Status becomes:** 

**Waiting for Freeze Dryer** 

**Production planning determines which trays enter the next drying cycle.** 

## **8.13 Weight Handling** 

**No mandatory weighing occurs before or after freezing.** 

**Inventory quantities remain unchanged.** 

**Weight differences caused by freezing are ignored for inventory purposes.** 

## **8.14 Inventory Update** 

**After completion:** 

**Inventory records:** 

- **Tray** 

- **Production Batch** 

- **Freezing Cycle** 

- **Current Location** 

- **Current Status** 

###### **The tray becomes available for Freeze Dryer loading.** 

## **8.15 Manager Priority** 

**Managers may prioritize trays.** 

**Examples:** 

- **Urgent customer order.** 

- **Production scheduling.** 

- **Machine availability.** 

**Priority affects Freeze Dryer loading order.** 

## **8.16 Exception Handling** 

**Tray Missing** 

**Assigned tray cannot be located.** 

**Exception created.** 

###### **Freezer Full** 

**Remaining trays stay in queue.** 

**Another freezing cycle is created later.** 

###### **Interrupted Cycle** 

**Cycle paused because of equipment maintenance.** 

**Operator resumes later.** 

###### **Damaged Tray** 

###### **Products transferred to another tray.** 

**Transfer recorded.** 

###### **Batch genealogy preserved.** 

###### **Manager Override** 

###### **Managers may:** 

- **Remove trays.** 

- **Add trays before the cycle starts.** 

- **Cancel a cycle.** 

###### **All actions are audited.** 

## **8.17 Audit Trail** 

###### **Every freezing operation records:** 

- **Session** 

- **Operator** 

- **Device** 

- **Freezer** 

- **Freezing Cycle** 

- **Tray** 

- **Production Batch** 

- **Start Time** 

- **End Time** 

- **Exceptions** 

- **Overrides** 

###### **These records are permanent.** 

## **8.18 Business Rules** 

- **Every freezing operation belongs to a Freezing Session.** 

- **Every tray belongs to one Production Batch.** 

- **A freezing cycle may contain multiple trays.** 

- **A freezing cycle may contain multiple Production Batches.** 

- **Trays cannot mix products from different Production Batches.** 

- **Freezing does not create a new Production Batch.** 

- **Freezing does not split or merge batches.** 

- **No official inventory weighing is required.** 

- **Completion automatically places trays into the Freeze Dryer queue.** 

- **All freezer loading operations are fully traceable.** 

## **8.19 End-to-End Example** 

**Production Batch PB-420** 

###### **↓** 

###### **Tray-01** 

###### **Tray-02** 

###### **Tray-03** 

###### **↓** 

###### **Create Freezing Cycle FC-310** 

###### **↓** 

###### **Load Freezer** 

###### **↓** 

###### **Freeze Complete** 

###### **↓** 

###### **Status:** 

###### **Frozen** 

**↓** 

###### **Move to Freeze Dryer Queue** 

###### **↓** 

###### **Inventory Updated** 

## **8.20 Workflow Summary** 

**The Freezing Workflow prepares sliced production batches for freeze drying by organizing trays into controlled freezing cycles.** 

**The workflow introduces Freezing Cycle as an operational entity while preserving production batch identity and tray-level traceability. By recording freezer loading, supporting multiple production batches within a single cycle, and maintaining immutable batch genealogy, the system provides accurate production tracking without adding unnecessary complexity to inventory management.** 

## **9 Freeze Drying Workflow** 

## **9.1 Purpose** 

**The Freeze Drying Workflow manages the complete lyophilization process from loading frozen trays into the freeze dryer until the finished dried product is unloaded and transferred to packaging.** 

###### **The objectives are to:** 

- **Record every Freeze Dryer Cycle.** 

- **Maintain complete production traceability.** 

- **Track tray locations during processing.** 

- **Record machine usage.** 

- **Generate finished production inventory.** 

- **Automatically create the next packaging tasks.** 

**The workflow manages production tracking only. Machine parameters such as shelf temperature, vacuum pressure, condenser temperature, and recipe settings are managed by the freeze dryer PLC and are not controlled by this system in Version 1.** 

## **9.2 Business Objectives** 

**The Freeze Drying Workflow transforms frozen products into finished freeze-dried products while preserving complete genealogy.** 

**The workflow records:** 

- **Which trays entered the machine.** 

- **Which production batches were processed.** 

- **Which Freeze Dryer Cycle produced the finished product.** 

- **Which operator performed loading and unloading.** 

- **Production start and completion times.** 

## **9.3 Workflow Overview** 

**Frozen Trays** 

**│** 

**▼** 

###### **Create Freeze Dryer Session** 

**│** 

**▼** 

###### **Scan Trays** 

**│** 

**▼** 

###### **Create Freeze Dryer Cycle** 

**│** 

**▼** 

###### **Load Machine** 

**│** 

**▼** 

###### **Start Production** 

**│** 

**▼** 

###### **Production Running** 

- **│** 

**▼** 

###### **Unload Trays** 

- **│** 

**▼** 

###### **Finished Product** 

**│** 

- 

###### **Create Packaging Task** 

## **9.4 Starting the Workflow** 

**The operator logs in.** 

**Role:** 

**Freeze Dryer Operator** 

**The workflow starts by:** 

- **Opening My Tasks** 

###### **or** 

- **Scanning tray QR codes.** 

## **9.5 Tray Validation** 

**Before loading the freeze dryer, the system validates:** 

- **Tray exists.** 

- **Tray status = Frozen.** 

- **Tray is waiting for Freeze Drying.** 

- **Tray is not assigned to another active cycle.** 

- **Tray is available.** 

###### **Only validated trays may enter the machine.** 

## **9.6 Freeze Dryer Session** 

**Every operation belongs to a Freeze Dryer Session.** 

**The session records:** 

- **Operator** 

- **Device** 

- **Freeze Dryer Machine** 

- **Start Time** 

- **End Time** 

###### **A session may include one or more machine cycles.** 

## **9.7 Freeze Dryer Cycle** 

**Each machine run creates one Freeze Dryer Cycle.** 

**Example:** 

**FDC-20260718-001** 

###### **The cycle records:** 

- **Machine** 

- **Recipe Name (optional)** 

- **Start Time** 

- **Finish Time** 

- **Trays Loaded** 

- **Operator** 

## **9.8 Loading Trays** 

**The operator scans each tray before placing it inside the machine.** 

**Example:** 

**Tray-001** 

**↓** 

**Shelf 1** 

###### **↓** 

###### **Tray-002** 

###### **↓** 

###### **Shelf 2** 

###### **↓** 

**Tray-003** 

###### **↓** 

###### **Shelf 3** 

###### **Recording shelf position is optional but recommended for troubleshooting.** 

## **9.9 Multiple Production Batches** 

**One Freeze Dryer Cycle may contain trays from many Production Batches.** 

**Example:** 

**Freeze Dryer Cycle** 

**↓** 

###### **PB-420** 

###### **↓** 

**PB-425** 

###### **↓** 

**PB-430** 

**↓** 

**PB-437** 

###### **This is a normal production practice.** 

**The genealogy of every tray remains independent.** 

## **9.10 Production Monitoring** 

**Version 1 records only operational milestones.** 

###### **Examples:** 

- **Loaded** 

- **Started** 

- **Running** 

- **Completed** 

- **Unloaded** 

**Machine telemetry is outside the project scope.** 

## **9.11 Cycle Completion** 

**When the cycle finishes:** 

**Tray Status changes from:** 

**Frozen** 

**to** 

**Freeze Dried** 

**The Freeze Dryer Cycle is closed.** 

## **9.12 Unloading** 

**The operator removes trays from the machine.** 

**Each tray is scanned during unloading.** 

**The system confirms:** 

- **Tray** 

- **Production Batch** 

- **Cycle Completion** 

## **9.13 Finished Product** 

**The physical product remains associated with the same Production Batch.** 

**Freeze drying does not create a new Production Batch.** 

**The following remain unchanged:** 

- **Product** 

- **Batch** 

- **Grade** 

- **Harvest Period** 

###### **● Supplier Contributions** 

**Only the processing status changes.** 

## **9.14 Weight Handling** 

**After unloading, the production batch is weighed.** 

**This becomes the official finished production weight.** 

**The system automatically calculates:** 

- **Input Weight (from Sorting)** 

- **Finished Weight** 

- **Drying Yield (%)** 

###### **Example:** 

**Input** 

**25.0 kg** 

**↓** 

**Finished** 

- **5.2 kg** 

**↓** 

**Yield** 

**20.8%** 

###### **Yield is recorded for production analysis.** 

## **9.15 Production Yield Warnings** 

**If the calculated yield falls outside configurable limits:** 

###### **Example:** 

- **Too Low** 

- **Too High** 

**The system creates a management flag.** 

**Production continues.** 

**Warnings do not block inventory updates.** 

## **9.16 Inventory Update** 

**When unloading is complete:** 

**Inventory records:** 

- **Production Batch** 

- **Finished Weight** 

- **Freeze Dryer Cycle** 

- **Current Location** 

- **Status = Ready for Packaging** 

## **9.17 Task Generation** 

**Completion automatically creates:** 

**Packaging Task** 

**The Packaging Operator immediately sees the new task.** 

## **9.18 Exception Handling** 

**Cycle Cancelled** 

**Cycle cancelled before production starts.** 

**Trays return to:** 

**Frozen** 

###### **Machine Failure** 

**Cycle interrupted.** 

###### **Manager decides whether to:** 

- **Resume** 

- **Restart** 

- **Scrap product** 

###### **Decision recorded.** 

###### **Tray Missing** 

###### **Expected tray not unloaded.** 

**Exception created.** 

###### **Yield Outside Limits** 

###### **Management warning created.** 

**Processing continues.** 

###### **Manager Override** 

###### **Managers may:** 

- **Cancel cycle** 

- **Reassign trays** 

- **Change production priority** 

###### **All actions are logged.** 

## **9.19 Audit Trail** 

###### **Every Freeze Dryer operation records:** 

- **Session** 

- **Cycle** 

- **Machine** 

- **Operator** 

- **Tray** 

- **Shelf Position (optional)** 

- **Production Batch** 

- **Input Weight** 

- **Finished Weight** 

- **Yield** 

- **Start Time** 

- **Completion Time** 

- **Exceptions** 

- **Overrides** 

###### **Audit records are permanent.** 

## **9.20 Business Rules** 

- **Every Freeze Drying operation belongs to a Freeze Dryer Session.** 

- **Every machine run creates one Freeze Dryer Cycle.** 

- **Only trays with Frozen status may be loaded.** 

- **One cycle may contain multiple Production Batches.** 

- **One tray belongs to only one Production Batch.** 

- **Freeze drying does not create a new Production Batch.** 

- **Finished weight is recorded after unloading.** 

- **Drying yield is calculated automatically.** 

- **Yield warnings do not block production.** 

- **Completion automatically generates Packaging tasks.** 

- **Complete genealogy between Production Batch, Tray, and Freeze Dryer Cycle is permanently preserved.** 

## **9.21 End-to-End Example** 

**Frozen Tray-101** 

###### **↓** 

###### **Scan Tray** 

###### **↓** 

###### **Create Freeze Dryer Cycle FDC-510** 

###### **↓** 

###### **Load Machine** 

###### **↓** 

###### **Production Complete** 

**↓** 

###### **Unload Tray** 

###### **↓** 

###### **Finished Weight = 5.1 kg** 

###### **↓** 

###### **Yield Calculated** 

###### **↓** 

###### **Status:** 

###### **Ready for Packaging** 

###### **↓** 

###### **Packaging Task Created** 

###### **↓** 

###### **Inventory Updated** 

## **9.22 Workflow Summary** 

**The Freeze Drying Workflow is the final manufacturing stage before packaging.** 

**It introduces Freeze Dryer Cycle as the primary production event, records machine utilization, calculates finished production yield, and transitions frozen production batches into finished goods ready for packaging. By preserving batch identity while capturing operational history and production metrics, the workflow delivers complete manufacturing traceability without unnecessary complexity in Version 1.** 

## **10 Conventional Drying Workflow** 

## **10.1 Purpose** 

**The Conventional Drying Workflow manages the production of naturally or mechanically dried products using hot-air drying or other conventional dehydration methods.** 

###### **The objectives are to:** 

- **Produce dried products outside the Freeze Drying process.** 

- **Maintain complete production traceability.** 

- **Record drying operations.** 

- **Calculate production yield.** 

- **Generate finished inventory.** 

- **Create packaging tasks automatically.** 

**The workflow is intentionally designed to be similar to the Freeze Drying Workflow so that future support for additional drying technologies can be added with minimal software changes.** 

## **10.2 Business Objectives** 

**The Conventional Drying Workflow transforms fresh products into dried products through a conventional drying process.** 

**The workflow records:** 

- **Which production batches entered the dryer.** 

- **Which drying cycle processed them.** 

- **Drying start and completion times.** 

- **Finished weight.** 

- **Production yield.** 

- **Operator and machine information.** 

## **10.3 Workflow Overview** 

###### **Production Batch** 

- **│** 

**▼** 

###### **Create Drying Session** 

**│** 

- 

###### **Scan Basket / Tray** 

- **│** 

- 

###### **Create Drying Cycle** 

- **│** 

- 

###### **Load Dryer** 

- **│** 

- 

###### **Start Drying** 

- **│** 

- 

###### **Drying Complete** 

- **│** 

- 

###### **Unload Product** 

- **│** 

- 

###### **Finished Weight** 

- **│** 

**▼** 

###### **Packaging Queue** 

## **10.4 Starting the Workflow** 

**The operator logs into the system.** 

**Role:** 

**Drying Operator** 

**The workflow begins through:** 

- **My Tasks** 

###### **or** 

- **Scanning the production batch container.** 

## **10.5 Container Validation** 

**Depending on the factory process, products may enter the dryer in baskets or drying trays.** 

**The system validates:** 

- **Container exists.** 

- **Status = Ready for Drying.** 

- **● Container is available.** 

- **Container is not assigned to another drying cycle.** 

**Only validated containers may be loaded.** 

## **10.6 Drying Session** 

**Every drying activity belongs to a Drying Session.** 

###### **The session records:** 

- **Operator** 

- **Device** 

- **Drying Machine** 

- **Start Time** 

- **End Time** 

## **10.7 Drying Cycle** 

**Each machine operation creates one Drying Cycle.** 

**Example:** 

**DC-20260720-003** 

###### **The cycle records:** 

- **Dryer** 

- **Recipe (optional)** 

- **Start Time** 

- **Finish Time** 

- **Production Batches** 

- **Operator** 

## **10.8 Loading the Dryer** 

**The operator scans every production container before loading.** 

**Example:** 

**Basket-021** 

**↓** 

**Basket-022** 

###### **↓** 

###### **Basket-023** 

###### **↓** 

###### **Start Cycle** 

###### **One drying cycle may process multiple production batches simultaneously.** 

## **10.9 Production Batch Integrity** 

###### **Conventional drying does not modify:** 

- **Product** 

- **Grade** 

- **Harvest Period** 

- **Supplier Contributions** 

- **Production Batch Identity** 

###### **The drying process changes only the processing status.** 

## **10.10 Production Monitoring** 

**Version 1 records operational milestones only.** 

###### **Examples:** 

- **Loaded** 

- **Started** 

- **Running** 

- **Completed** 

- **Unloaded** 

###### **Dryer temperature, humidity, airflow, and recipe parameters are managed by the machine itself and are outside the scope of Version 1.** 

## **10.11 Cycle Completion** 

**After drying:** 

**Container Status changes from:** 

**Ready for Drying** 

**to** 

**Conventionally Dried** 

**The Drying Cycle is closed.** 

## **10.12 Finished Weight** 

**The finished production batch is weighed immediately after unloading.** 

**The system stores:** 

- **Input Weight** 

- **Finished Weight** 

- **Production Yield** 

**Example:** 

**Input** 

- **18.5 kg** 

**↓** 

**Finished** 

###### **3.8 kg** 

**↓** 

**Yield** 

**20.5%** 

## **10.13 Yield Calculation** 

**The system automatically calculates:** 

**Production Yield (%)** 

**This value is stored for:** 

- **Production analysis** 

- **Historical reporting** 

- **Performance comparison** 

## **10.14 Yield Warnings** 

**If the yield falls outside configurable thresholds:** 

**Examples:** 

- **Excessive loss** 

- **Abnormally high yield** 

**The system generates a management warning.** 

**Production continues.** 

###### **Warnings never block workflow completion.** 

## **10.15 Inventory Update** 

**After drying:** 

###### **Inventory records:** 

- **Production Batch** 

- **Finished Weight** 

- **Drying Cycle** 

- **Current Location** 

- **Status = Ready for Packaging** 

## **10.16 Task Generation** 

**Completion automatically generates:** 

**Packaging Task** 

**The Packaging Operator immediately receives the task.** 

## **10.17 Exception Handling** 

###### **Machine Failure** 

**Cycle interrupted.** 

**Manager decides:** 

- **Resume** 

- **Restart** 

- **Scrap Product** 

**Decision recorded.** 

###### **Container Missing** 

###### **Expected container not unloaded.** 

###### **Exception created.** 

###### **Yield Outside Limits** 

###### **Management warning generated.** 

###### **Inventory updated normally.** 

###### **Manager Override** 

###### **Managers may:** 

- **Cancel cycle** 

- **Change priority** 

- **Reassign production batches** 

###### **All actions are audited.** 

## **10.18 Audit Trail** 

###### **Every drying operation records:** 

- **Session** 

- **Drying Cycle** 

- **Machine** 

- **Operator** 

- **Container** 

- **Production Batch** 

- **Input Weight** 

- **Finished Weight** 

- **Yield** 

- **Start Time** 

- **End Time** 

- **Exceptions** 

- **Manager Overrides** 

###### **All records are permanent.** 

## **10.19 Business Rules** 

- **Every drying operation belongs to a Drying Session.** 

- **Every machine run creates one Drying Cycle.** 

- **Only production batches with Ready for Drying status may be processed.** 

- **One drying cycle may include multiple production batches.** 

- **Conventional drying does not create a new production batch.** 

- **Finished weight is recorded after unloading.** 

- **Yield is calculated automatically.** 

- **Yield warnings generate management flags only.** 

- **Completion automatically creates Packaging tasks.** 

- **Production genealogy remains unchanged throughout the drying process.** 

## **10.20 End-to-End Example** 

**Production Batch PB-610** 

###### **↓** 

###### **Ready for Drying** 

###### **↓** 

###### **Create Drying Cycle DC-210** 

###### **↓** 

###### **Load Dryer** 

###### **↓** 

###### **Drying Complete** 

###### **↓** 

###### **Finished Weight = 4.2 kg** 

###### **↓** 

###### **Yield Calculated** 

###### **↓** 

###### **Status:** 

###### **Ready for Packaging** 

###### **↓** 

###### **Packaging Task Created** 

###### **↓** 

###### **Inventory Updated** 

## **10.21 Workflow Summary** 

**The Conventional Drying Workflow manages products processed through nonfreeze-drying dehydration methods while maintaining the same traceability model used throughout the factory.** 

**By introducing the Drying Cycle as the operational entity, recording finished weight and production yield, and automatically generating packaging tasks, the workflow provides a consistent production model across all drying technologies. This unified approach simplifies implementation, reporting, and future system expansion while preserving complete batch genealogy and operational history.** 

## **11 Packaging Workflow** 

## **11.1 Purpose** 

**The Packaging Workflow converts finished production batches into saleable products by packing them into retail packages.** 

**Packaging is the point at which individual traceable products are created.** 

###### **Its objectives are to:** 

- **Produce retail-ready products.** 

- **Assign a unique serial number to every package.** 

- **Print product labels.** 

- **Build cartons from finished packages.** 

- **Update finished goods inventory.** 

- **Maintain complete traceability from supplier to finished product.** 

###### **Unlike previous workflows, Packaging creates new inventory units that are sold to customers.** 

## **11.2 Business Objectives** 

###### **The Packaging Workflow must:** 

- **Consume finished production batches.** 

- **Produce individually identifiable retail packages.** 

- **Record the relationship between every package and its originating Production Batch.** 

- **Create cartons.** 

- **Prepare finished goods for shipment.** 

## **11.3 Workflow Overview** 

###### **Ready for Packaging** 

- **│** 

**▼** 

###### **Create Packaging Session** 

**│** 

**▼** 

###### **Retrieve Production Batch** 

**│** 

**▼** 

###### **Scan Batch** 

**│** 

**▼** 

###### **Weigh Product** 

**│** 

**▼** 

###### **Fill Retail Package** 

**│** 

**▼** 

###### **Seal Package** 

**│** 

**▼** 

###### **Print Package Label** 

**│** 

**▼** 

###### **Scan Package into Carton** 

**│** 

**▼** 

###### **Print Carton Label** 

**│** 

**▼** 

###### **Finished Goods Warehouse** 

## **11.4 Starting the Workflow** 

**The operator logs into the system.** 

**Role:** 

**Packaging Operator** 

**The workflow starts through:** 

- **My Tasks** 

###### **or** 

- **Scanning the Production Batch.** 

## **11.5 Batch Validation** 

###### **Before packaging begins, the system validates:** 

- **Production Batch exists.** 

- **Status = Ready for Packaging.** 

- **Batch is available.** 

- **Batch is not already assigned to another Packaging Session.** 

###### **Only validated batches may be packaged.** 

## **11.6 Packaging Session** 

**Every packaging activity belongs to a Packaging Session.** 

###### **The session records:** 

- **Operator** 

- **Device** 

- **Start Time** 

- **End Time** 

- **Production Batch** 

- **Packages Produced** 

###### **Sessions support pause and resume.** 

## **11.7 Packaging Configuration** 

**Package specifications are configurable.** 

###### **Examples:** 

- **10 g** 

- **20 g** 

- **30 g** 

- **50 g** 

- **100 g** 

###### **Configuration also defines:** 

- **Package type** 

- **Label template** 

- **Target weight** 

- **Weight tolerance** 

###### **All packaging formats are managed through the Configuration Module.** 

## **11.8 Package Creation** 

**For each retail package:** 

###### **The operator:** 

- **Fills the pouch.** 

- **Places it on the scale.** 

- **Confirms the weight.** 

- **Seals the package.** 

###### **The system creates one Package record.** 

###### **Example:** 

###### **Production Batch PB-701** 

**↓** 

**Package PK-000001** 

**↓** 

**Package PK-000002** 

**↓** 

**Package PK-000003** 

###### **Each package receives its own identity.** 

## **11.9 Package Identification** 

**Every package receives:** 

- **Package ID** 

- **QR Code** 

- **Serial Number** 

**The package becomes the primary traceable finished product.** 

## **11.10 Package Label** 

**After successful weighing, the label is printed automatically.** 

**Typical label contents:** 

- **Product Name** 

- **Net Weight** 

- **Lot Number** 

- **Production Date** 

- **Expiry Date** 

- **QR Code** 

- **Package Serial Number** 

**Label templates are configurable.** 

## **11.11 Weight Validation** 

**Each package is checked against the configured tolerance.** 

**Examples:** 

**Target:** 

**20 g** 

**Tolerance:** 

**±0.5 g** 

###### **Possible outcomes:** 

- **Within tolerance → Accept.** 

- **● Outside tolerance → Warning displayed.** 

**Managers may configure whether an out-of-tolerance package must be corrected or only flagged. For Version 1, the default behavior is to require correction before the package can be finalized.** 

## **11.12 Package Inventory** 

###### **Immediately after label printing:** 

**Package Status becomes:** 

###### **Finished Package** 

**Inventory now tracks the package as an independent sellable item.** 

## **11.13 Carton Assembly** 

**Retail packages are packed into cartons.** 

**The operator scans every package while placing it inside the carton.** 

**The operator does not scan the carton first.** 

**Example:** 

**Scan Package** 

###### **↓** 

**Scan Package** 

###### **↓** 

**Scan Package** 

###### **↓** 

**Complete Carton** 

**↓** 

###### **Print Carton Label** 

###### **The carton is created only after confirmation.** 

## **11.14 Carton Creation** 

**After all packages have been scanned:** 

**The system creates one Carton.** 

###### **The carton stores:** 

- **Carton ID** 

- **Carton QR** 

- **Number of Packages** 

- **Total Weight** 

- **Package List** 

###### **The package list is permanent.** 

## **11.15 Carton Label** 

**The carton label is printed automatically after creation.** 

###### **Typical contents:** 

- **Carton QR** 

- **Carton Number** 

- **Number of Packages** 

- **Gross Weight** 

- **Destination (optional)** 

## **11.16 Label Failure Recovery** 

###### **If the carton label cannot be printed:** 

###### **Examples:** 

- **Printer out of labels.** 

- **Printer offline.** 

- **Communication error.** 

###### **The carton receives the status:** 

###### **Pending Label** 

**The carton is added to the Pending Label Queue.** 

## **11.17 Safe Reprint Process** 

**To prevent applying the wrong label to the wrong carton, cartons without labels must remain open at the packaging station and must not be moved to the warehouse.** 

###### **When reprinting:** 

**1. The operator opens the Pending Label Queue. 2. The system displays the pending carton information. 3. The operator identifies the physical carton using its temporary packing position or workstation sequence.** 

**4. The operator selects Reprint. 5. The label is printed. 6. The label is immediately attached. 7. The carton status changes to Ready.** 

###### **Every reprint is logged.** 

###### **Version 1 Rule: Unlabeled cartons cannot leave the packaging station. This eliminates the risk of attaching a valid label to the wrong carton.** 

## **11.18 Inventory Update** 

**After carton completion:** 

**Inventory contains:** 

- **Finished Packages** 

- **Cartons** 

**The Production Batch quantity is reduced according to packaged weight.** 

**When all product has been packaged:** 

**Production Batch Status becomes:** 

###### **Completed** 

## **11.19 Finished Goods Warehouse** 

**Completed cartons are transferred to the Finished Goods Warehouse.** 

**The system records:** 

- **Warehouse Location** 

- **Operator** 

- **Time** 

- **Carton** 

## **11.20 Exception Handling** 

###### **Package Outside Tolerance** 

**Package cannot be finalized until corrected.** 

###### **Printer Failure** 

**Carton enters the Pending Label Queue.** 

###### **Wrong Package Scanned** 

**Operator removes the package before confirming the carton.** 

###### **Duplicate Package** 

###### **System blocks duplicate scanning.** 

###### **Carton Cancelled** 

###### **Before confirmation:** 

###### **Packages return to Finished Package inventory.** 

###### **Manager Override** 

###### **Managers may:** 

- **Reopen cartons.** 

- **Cancel cartons.** 

- **Reprint labels.** 

- **Move cartons.** 

###### **All actions are audited.** 

## **11.21 Audit Trail** 

###### **Every packaging event records:** 

- **Packaging Session** 

- **Operator** 

- **Device** 

- **Production Batch** 

- **Package** 

- **Weight** 

- **Carton** 

- **Label Prints** 

- **Label Reprints** 

- **Warehouse Movement** 

- **Exceptions** 

- **Manager Overrides** 

###### **All records are permanent.** 

## **11.22 Business Rules** 

- **Every packaging operation belongs to a Packaging Session.** 

- **Only Production Batches with Ready for Packaging status may be packaged.** 

- **Every retail package receives a unique serial number and QR code.** 

- **Every retail package is individually traceable.** 

- **Package weight must satisfy the configured tolerance before finalization.** 

- **Cartons are created only after scanning all packages.** 

- **Operators scan packages, not empty cartons.** 

- **Every carton stores the complete list of contained package serial numbers.** 

- **Carton labels are printed only after carton creation.** 

- **Unlabeled cartons remain at the packaging station until successfully labeled.** 

- **Every label reprint is permanently logged.** 

- **Completion updates Finished Goods inventory automatically.** 

## **11.23 End-to-End Example** 

**Production Batch PB-701** 

###### **↓** 

###### **Packaging Session** 

###### **↓** 

**Create Package PK-001** 

**Create Package PK-002 Create Package PK-003** 

###### **↓** 

###### **Print Package Labels** 

###### **↓** 

###### **Scan Packages into Carton** 

###### **↓** 

###### **Create Carton CT-110** 

###### **↓** 

###### **Print Carton Label** 

###### **↓** 

###### **Move to Finished Goods Warehouse** 

###### **↓** 

###### **Inventory Updated** 

###### **↓** 

###### **Packaging Complete** 

## **11.24 Workflow Summary** 

**The Packaging Workflow transforms finished production batches into retail-ready products and establishes the final level of product traceability.** 

**By assigning a unique identity to every package, building cartons from scanned package serial numbers, enforcing controlled label printing and reprint procedures, and automatically updating finished goods inventory, the workflow creates a reliable foundation for storage, shipment, customer traceability, and product recalls while remaining practical for daily factory operations.** 

## **12 Inventory Movement Workflow** 

## **12.1 Purpose** 

**The Inventory Movement Workflow manages every physical movement of products, baskets, trays, packages, cartons, and shipping units throughout the factory.** 

**Unlike production workflows, this workflow does not transform products. Its purpose is to maintain an accurate digital representation of the physical location of every inventory item.** 

**Every movement is recorded permanently to provide complete traceability and inventory history.** 

## **12.2 Business Objectives** 

**The objectives of Inventory Movement are to:** 

- **Track the exact location of inventory.** 

- **Record every physical movement.** 

- **Maintain real-time inventory visibility.** 

- **Support mobile warehouse operations.** 

- **Preserve complete movement history.** 

- **Eliminate manual inventory adjustments whenever possible.** 

###### **Inventory Movement occurs independently of production.** 

## **12.3 Workflow Overview** 

###### **Inventory Item** 

- **│** 

- 

###### **Create Movement Task** 

**│** 

**▼** 

###### **Retrieve Item** 

**│** 

**▼** 

###### **Scan Source** 

**│** 

**▼** 

###### **Scan Item** 

**│** 

**▼** 

###### **Scan Destination** 

**│** 

**▼** 

###### **Confirm Movement** 

**│** 

**▼** 

###### **Inventory Updated** 

**│** 

**▼** 

###### **Movement Logged** 

## **12.4 Inventory Objects** 

**The system tracks the movement of different inventory objects.** 

###### **Depending on the workflow, these may include:** 

- **Basket** 

- **Tray** 

- **Production Batch** 

- **Retail Package** 

- **Carton** 

- **EPS Shipping Box** 

- **Pallet** 

###### **Each object has a unique identity.** 

## **12.5 Storage Locations** 

**Every inventory object belongs to one location.** 

**Examples:** 

**Receiving Area** 

**Cold Storage** 

**Sorting Area** 

**Washing Area** 

**Slicing Area** 

**Freezing Area** 

**Freeze Dryer** 

**Drying Area** 

**Packaging** 

**Finished Goods Warehouse Dispatch Area** 

**Locations are configurable through the Configuration Module.** 

## **12.6 Movement Types** 

###### **The system supports multiple movement types.** 

###### **Examples:** 

- **Receiving** 

- **Internal Transfer** 

- **Production Transfer** 

- **Warehouse Transfer** 

- **Shipment Allocation** 

- **Return to Warehouse** 

- **Adjustment (Manager Only)** 

###### **Each movement type is recorded separately.** 

## **12.7 Starting a Movement** 

**The operator opens:** 

**Inventory Movement** 

**The operator may start by:** 

- **My Tasks** 

###### **or** 

- **Scanning an inventory object.** 

## **12.8 Validation** 

###### **Before movement is completed, the system validates:** 

- **Inventory object exists.** 

- **Object is active.** 

- **Object is not locked.** 

- **Destination is valid.** 

- **Operator has permission.** 

###### **If validation fails, movement cannot continue.** 

## **12.9 QR-Based Movement** 

**The standard movement sequence is:** 

**Scan Source** 

###### **↓** 

**Scan Basket / Tray / Carton** 

###### **↓** 

###### **Scan Destination** 

###### **↓** 

**Confirm** 

###### **Scanning minimizes manual data entry.** 

## **12.10 Automatic Production Movements** 

**Many inventory movements occur automatically after production completion.** 

**Examples:** 

**Receiving** 

**↓** 

###### **Cold Storage** 

###### **Sorting** 

###### **↓** 

**Washing** 

**Freeze Drying** 

###### **↓** 

**Packaging** 

**Packaging** 

###### **↓** 

###### **Finished Goods** 

**These movements are generated by the workflow itself.** 

**Operators do not need to perform separate inventory transactions.** 

## **12.11 Manual Warehouse Movements** 

**Warehouse staff may manually move inventory.** 

**Examples:** 

**Warehouse A** 

###### **↓** 

###### **Warehouse B** 

**Cold Storage Zone 1** 

###### **↓** 

**Cold Storage Zone 2** 

###### **Finished Goods** 

###### **↓** 

###### **Quality Inspection** 

###### **These movements require confirmation.** 

## **12.12 Batch Integrity** 

###### **Moving inventory never changes:** 

- **Product** 

- **Production Batch** 

- **Grade** 

- **Harvest Period** 

- **Supplier Contributions** 

**Movement affects only location.** 

## **12.13 Inventory Status** 

**Every inventory object has both:** 

###### **Physical Location** 

**Example:** 

**Cold Storage Zone B** 

###### **Operational Status** 

**Example:** 

**Ready for Washing** 

**Both are stored independently.** 

**This allows situations such as:** 

**Status:** 

**Ready for Freeze Drying** 

**Location:** 

**Cold Room Holding Area** 

## **12.14 Mobile Operations** 

###### **Android PDA operators may:** 

- **Scan inventory.** 

- **View current location.** 

- **View destination.** 

- **Execute movement.** 

- **Report exceptions.** 

**The workflow supports offline queueing if the network connection is temporarily unavailable. Once connectivity is restored, queued movements are synchronized automatically.** 

## **12.15 Inventory Search** 

###### **Managers may search by:** 

- **Basket** 

- **Tray** 

- **Batch** 

- **Package** 

- **Carton** 

- **Shipment** 

- **Product** 

- **Supplier** 

- **Harvest Period** 

- **Warehouse** 

- **Current Status** 

- **Current Location** 

###### **Inventory updates immediately after each confirmed movement.** 

## **12.16 Exception Handling** 

**Item Not Found** 

**Scanned QR does not exist.** 

###### **Movement cancelled.** 

###### **Wrong Destination** 

###### **Destination is not compatible with the object's current status.** 

###### **Movement blocked.** 

###### **Example:** 

**Trying to move a basket with status Ready for Washing directly to the Finished Goods Warehouse.** 

###### **Locked Inventory** 

###### **Object currently belongs to another active session.** 

###### **Movement blocked.** 

###### **Duplicate Movement** 

**The object has already been moved.** 

###### **Second movement rejected.** 

###### **Emergency Relocation** 

###### **Manager may relocate inventory immediately.** 

###### **Reason must be recorded.** 

## **12.17 Inventory Adjustment** 

**Inventory adjustments are extremely rare.** 

**Only authorized managers may perform:** 

- **Quantity Adjustment** 

- **Weight Adjustment** 

- **Location Correction** 

###### **Every adjustment requires:** 

- **Reason** 

- **Manager Approval** 

- **Audit Record** 

###### **No inventory record is permanently deleted.** 

## **12.18 Audit Trail** 

###### **Every movement records:** 

- **Movement ID** 

- **Date** 

- **Time** 

- **Operator** 

- **Device** 

- **Source Location** 

- **Destination Location** 

- **Inventory Object** 

- **Object Type** 

- **Movement Type** 

- **Session (if applicable)** 

###### **Movement history is immutable.** 

## **12.19 Business Rules** 

- **Every inventory object always belongs to one physical location.** 

- **Inventory movement never changes product identity.** 

- **Inventory movement never changes batch genealogy.** 

- **QR scanning is the preferred movement method.** 

- **Automatic workflow movements require no additional operator action.** 

- **Manual movements require confirmation.** 

- **Invalid destination movements are blocked.** 

- **Locked inventory cannot be moved.** 

- **Inventory adjustments require manager authorization.** 

- **Every movement becomes a permanent audit event.** 

## **12.20 End-to-End Example** 

**Basket BASKET-104** 

###### **Current Location:** 

**Cold Storage** 

###### **↓** 

###### **Scan Basket** 

###### **↓** 

###### **Destination:** 

###### **Sorting Area** 

###### **↓** 

###### **Confirm** 

###### **↓** 

###### **Inventory Updated** 

**↓** 

###### **Movement Event Created** 

###### **↓** 

###### **Sorting Task Available** 

## **12.21 Inventory State Model** 

**Every inventory object is defined by the combination of:** 

- **Identity** 

- **Current Status** 

- **Current Location** 

- **Current Container (if applicable)** 

###### **Example:** 

**P Value ro p er ty O Production bj Batch PB-701 e ct S Ready for ta Packaging t u s L Packaging** 

**o Holding Area c at io n C Tray-021 o n ta in er** 

**This separation allows operational flexibility while preserving complete traceability.** 

## **12.22 Workflow Summary** 

**The Inventory Movement Workflow serves as the logistics backbone of the factory.** 

**It records every physical transfer without altering product identity or genealogy, ensuring that inventory always reflects the actual state of the factory. By combining QR-based confirmation, automatic workflow-driven transfers, configurable warehouse locations, and immutable movement history, the system provides realtime inventory accuracy, supports mobile operations, and enables complete traceability across the entire production lifecycle.** 

## **13 Shipping Workflow** 

## **13.1 Purpose** 

**The Shipping Workflow manages the preparation, verification, loading, and dispatch of customer orders.** 

###### **Its objectives are to:** 

- **Ship the correct products.** 

- **Ensure complete shipment traceability.** 

- **Prevent shipping errors.** 

- **Update inventory automatically.** 

- **Record shipment history.** 

- **Support domestic and export shipments.** 

###### **Shipping is the final operational step of the production lifecycle.** 

## **13.2 Business Objectives** 

**The Shipping Workflow ensures that:** 

- **Every shipment matches a customer order.** 

- **Every shipped item is verified.** 

- **Inventory is updated immediately.** 

- **Every carton can be traced after shipment.** 

- **Shipment documents are generated.** 

- **Loading operations are recorded.** 

## **13.3 Workflow Overview** 

###### **Sales Order** 

- **│** 

- 

###### **Create Shipment** 

**│** 

**▼** 

###### **Generate Picking Tasks** 

**│** 

**▼** 

###### **Pick Cartons** 

**│** 

**▼** 

###### **Scan Cartons** 

**│** 

**▼** 

###### **Quality Verification** 

- **│** 

**▼** 

###### **Load Vehicle** 

- **│** 

**▼** 

###### **Confirm Shipment** 

- **│** 

**▼** 

###### **Inventory Updated** 

**│** 

**▼** 

###### **Shipment Closed** 

## **13.4 Shipping Objects** 

###### **The Shipping Workflow manages:** 

- **Sales Orders** 

- **Shipments** 

- **Cartons** 

- **EPS Shipping Boxes (Fresh Export)** 

- **Pallets (Optional)** 

- **Vehicles** 

- **Customers** 

###### **Individual retail packages are normally shipped inside cartons and are not scanned separately during shipment.** 

## **13.5 Shipment Creation** 

**A Shipment is created from one Sales Order.** 

###### **A shipment contains:** 

- **Customer** 

- **Shipping Address** 

- **Shipment Number** 

- **Shipment Date** 

- **Shipping Method** 

- **Destination** 

- **Required Cartons** 

###### **Example:** 

###### **Sales Order SO-1025** 

###### **↓** 

###### **Shipment SH-301** 

## **13.6 Picking Tasks** 

**Once the shipment is created, the system generates picking tasks.** 

**Warehouse operators receive:** 

**My Tasks** 

**Example:** 

**Pick Carton CT-1001** 

**↓** 

**Pick Carton CT-1008** 

**↓** 

**Pick Carton CT-1015** 

###### **Picking priority may be optimized based on warehouse location.** 

## **13.7 Carton Validation** 

**Before loading, every carton is scanned.** 

**The system verifies:** 

- **Carton exists.** 

- **Carton status = Ready to Ship.** 

- **Carton belongs to the shipment.** 

- **Carton has not already been shipped.** 

- **Carton is not locked.** 

**Only validated cartons can be loaded.** 

## **13.8 Fresh Export Validation** 

**For fresh shipments, the operator scans the EPS Shipping Box instead of individual nets.** 

###### **The system verifies:** 

- **EPS box exists.** 

- **EPS box belongs to the shipment.** 

- **● Label has been printed.** 

- **Box has not already been shipped.** 

## **13.9 Shipment Verification** 

**After all cartons are scanned, the system compares:** 

**Expected Cartons** 

###### **vs** 

###### **Scanned Cartons** 

###### **Possible outcomes:** 

- **Complete** 

- **● Missing Cartons ● Unexpected Cartons** 

###### **Shipment cannot be finalized until all required cartons are verified.** 

## **13.10 Loading Vehicle** 

**Once verification is complete:** 

**The operator loads cartons into the assigned vehicle.** 

**Optionally, cartons may be scanned during loading to record the loading sequence.** 

###### **The system stores:** 

- **Vehicle** 

- **Loading Time** 

- **Operator** 

## **13.11 Shipment Documents** 

**After verification, the system generates shipment documents.** 

###### **Examples:** 

- **Packing List** 

- **Carton List** 

- **Shipment Summary** 

**Commercial invoices, export customs documents, health certificates, and airway bills are handled outside Version 1.** 

## **13.12 Inventory Update** 

**When shipment is confirmed:** 

**Carton Status changes from:** 

**Ready to Ship** 

###### **to** 

###### **Shipped** 

**Inventory is immediately reduced.** 

**Shipped products are no longer available for sale.** 

## **13.13 Shipment Completion** 

**The Shipment Status changes:** 

###### **Draft** 

###### **↓** 

###### **Picking** 

###### **↓** 

###### **Ready** 

###### **↓** 

###### **Loaded** 

###### **↓** 

###### **Shipped** 

###### **↓** 

###### **Closed** 

###### **Once closed, shipments become read-only.** 

## **13.14 Partial Shipment** 

**If only part of an order is available:** 

**Example:** 

**Order:** 

**100 Cartons** 

**Available:** 

**70 Cartons** 

**The system allows:** 

**Partial Shipment** 

**The remaining cartons stay allocated to the Sales Order until another shipment is created.** 

## **13.15 Shipment Cancellation** 

**Before shipment confirmation:** 

**Managers may cancel the shipment.** 

**Effects:** 

- **Cartons return to Finished Goods Inventory.** 

- **Picking tasks are cancelled.** 

- **Inventory availability is restored.** 

**No genealogy is affected.** 

## **13.16 Exception Handling** 

###### **Wrong Carton** 

**Operator scans a carton that belongs to another shipment.** 

**Shipment is blocked.** 

###### **Duplicate Scan** 

**The same carton is scanned twice.** 

**The duplicate scan is rejected.** 

###### **Missing Carton** 

**One or more required cartons are missing.** 

**Shipment cannot be completed until resolved or the shipment is changed to a partial shipment.** 

###### **Damaged Carton** 

**A damaged carton is removed from the shipment.** 

**If replacement inventory exists, another carton may be assigned.** 

**Manager approval is required.** 

###### **Shipment Cancellation** 

**Only managers may cancel confirmed picking operations.** 

**All actions are logged.** 

## **13.17 Audit Trail** 

**Every shipment records:** 

- **Shipment ID** 

- **Sales Order** 

- **Customer** 

- **Operator** 

- **Vehicle** 

- **Cartons** 

- **EPS Shipping Boxes (Fresh Export)** 

- **Shipment Date** 

- **Loading Time** 

- **Completion Time** 

- **Exceptions** 

- **Manager Overrides** 

###### **All shipment history is permanent.** 

## **13.18 Business Rules** 

- **Every shipment originates from one Sales Order.** 

- **A shipment may contain multiple cartons and/or multiple EPS shipping boxes.** 

- **Cartons must be scanned before shipment confirmation.** 

- **Fresh export shipments use EPS shipping boxes rather than individual nets.** 

- **Only inventory with status Ready to Ship may be loaded.** 

- **Shipment confirmation immediately deducts inventory.** 

- **Partial shipments are allowed.** 

- **Cancelled shipments restore inventory availability.** 

- **Closed shipments cannot be modified.** 

- **Every shipment event is permanently audited.** 

## **13.19 End-to-End Example** 

###### **Sales Order SO-1025** 

###### **↓** 

###### **Create Shipment SH-301** 

###### **↓** 

**Generate Picking Tasks** 

###### **↓** 

###### **Pick CT-1001** 

###### **Pick CT-1002** 

###### **Pick CT-1003** 

###### **↓** 

###### **Scan Cartons** 

###### **↓** 

###### **Verify Shipment** 

###### **↓** 

###### **Load Vehicle** 

###### **↓** 

###### **Confirm Shipment** 

###### **↓** 

###### **Inventory Updated** 

**↓** 

###### **Status:** 

###### **Shipped** 

**↓** 

###### **Shipment Closed** 

## **13.20 Workflow Summary** 

**The Shipping Workflow is the final operational process in the system. It ensures that only verified cartons or fresh-export shipping boxes are dispatched, automatically updates inventory, supports full and partial shipments, and creates a permanent audit trail linking the Sales Order, Shipment, Vehicle, Customer, and every shipped inventory unit.** 

**By using mandatory barcode verification before loading, the workflow minimizes shipping errors while preserving complete end-to-end traceability from supplier to customer.** 

## **14 Label Printing Workflow** 

## **14.1 Purpose** 

**The Label Printing Workflow manages the generation, printing, reprinting, and tracking of all barcode labels used throughout the factory.** 

###### **The objectives are to:** 

- **Ensure every traceable object has the correct label.** 

- **Prevent duplicate labels.** 

- **Support automatic and manual printing.** 

- **Track every print and reprint operation.** 

- **Prevent incorrect label attachment.** 

- **Maintain complete printing history.** 

###### **The system treats labels as controlled production documents.** 

## **14.2 Business Objectives** 

**The Label Printing Workflow ensures that:** 

- **Every label belongs to exactly one object.** 

- **Labels are printed at the correct stage.** 

- **Failed prints are recoverable.** 

- **Reprints are fully audited.** 

- **Duplicate labels are prevented.** 

## **14.3 Supported Label Types** 

**The system supports multiple label types.** 

**Examples:** 

**Label Type** 

**Printed** 

||**For**|
|---|---|
|**Basket Label**|**Receivin**<br>**g Basket**|
|**Tray Label**|**Producti**<br>**on Tray**|
|**Retail Package**<br>**Label**|**Finished**<br>**Package**|
|**Carton Label**|**Carton**|
|**EPS Shipping**<br>**Box Label**|**Fresh**<br>**Export**<br>**Box**|
|**Pallet Label**|**Optional**|
|**Shipment**<br>**Label**|**Optional**|



**New label types can be added through the Configuration Module.** 

## **14.4 Workflow Overview** 

###### **Business Event** 

**│** 

**▼** 

**Create Label Request** 

**│** 

**▼** 

###### **Generate Label Data** 

**│** 

**▼** 

###### **Send to Printer** 

**│ ▼** 

###### **Print Success?** 

**┌──────┴──────┐ │ │ Yes           No │ │ ▼ ▼** 

###### **Label Ready   Pending Label Queue** 

**│ │ └──────┬──────┘ ▼ Reprint (if needed)** 

## **14.5 Automatic Label Printing** 

**Most labels are generated automatically by the workflow.** 

**Examples:** 

###### **Receiving** 

###### **↓** 

###### **Print Basket Label** 

###### **Packaging** 

###### **↓** 

**Print Package Label** 

**Carton Completed** 

###### **↓** 

**Print Carton Label** 

**Fresh Export Box Completed** 

###### **↓** 

**Print EPS Box Label** 

**No manual intervention is required under normal operation.** 

## **14.6 Manual Label Printing** 

**Authorized users may manually print labels.** 

###### **Examples:** 

- **Lost label** 

- **Damaged label** 

- **Printer maintenance** 

- **Testing a new printer** 

###### **Manager permission may be required depending on the label type.** 

## **14.7 Label Generation** 

**Before printing, the system generates the label content.** 

**Typical data includes:** 

- **QR Code** 

- **Barcode** 

- **Object ID** 

- **Product Name** 

- **Weight** 

- **Production Date** 

- **Expiry Date** 

- **Lot Number** 

- **Configuration-specific fields** 

**The exact layout depends on the configured label template.** 

## **14.8 Printer Assignment** 

**Each workstation may have one default label printer.** 

**Example:** 

|**Work**<br>**stati**<br>**on**|**Print**<br>**er**|
|---|---|
|**Rece**<br>**iving**|**Zebr**<br>**a**<br>**ZD22**<br>**0**|
|**Pack**<br>**agin**<br>**g**|**Zebr**<br>**a**<br>**ZD22**<br>**0**|
|**Ware**<br>**hous**<br>**e**|**Zebr**<br>**a**<br>**ZD22**<br>**0**|



###### **Printer assignments are configurable.** 

## **14.9 Print Confirmation** 

**After sending the print job:** 

###### **If the printer confirms successful printing:** 

**Label Status becomes:** 

###### **Printed** 

**If confirmation is unavailable (for example, due to standard USB printing), the system assumes the job was submitted successfully unless an operating system error is returned.** 

## **14.10 Pending Label Queue** 

**If printing fails:** 

**Examples:** 

- **Printer offline** 

- **Paper finished** 

- **Ribbon finished** 

- **Communication failure** 

**The object receives:** 

**Pending Label** 

**The label request enters the Pending Label Queue.** 

## **14.11 Safe Reprint Workflow** 

**To prevent attaching the wrong label to the wrong object:** 

**The operator opens:** 

**Pending Label Queue** 

**The system displays:** 

- **Object ID** 

- **Label Type** 

- **Creation Time** 

- **Current Status** 

###### **The operator selects:** 

###### **Reprint** 

**The system prints exactly the same label.** 

**No new serial number is generated.** 

## **14.12 Duplicate Protection** 

**The system never creates a second identity.** 

**Reprinting produces an identical copy of the original label.** 

**Example:** 

**Package** 

**PK-10025** 

###### **↓** 

**Print** 

###### **↓** 

**Reprint** 

###### **↓** 

**Same QR** 

**Same Serial** 

###### **Same Identity** 

## **14.13 Printer Failure Recovery** 

**If multiple labels fail:** 

**Example:** 

**Pending Queue** 

###### **↓** 

###### **Carton 101** 

###### **↓** 

###### **Carton 102** 

###### **↓** 

**Carton 103** 

**Each label is reprinted individually.** 

###### **The system records:** 

- **Original print** 

- **Failed attempt** 

- **Successful reprint** 

## **14.14 Physical Verification Rule** 

**To minimize the risk of attaching labels to the wrong object:** 

**Version 1 follows these operational rules:** 

- **Unlabeled cartons and EPS shipping boxes must remain at the printing station.** 

- **They cannot be moved to storage.** 

- **The label must be attached immediately after printing.** 

- **Only then may the object continue through the workflow.** 

**This operational rule eliminates almost all label mix-up scenarios without requiring additional hardware.** 

## **14.15 Label Templates** 

**Each label type has its own configurable template.** 

**Examples:** 

**Package Label** 

###### **↓** 

###### **20 g Retail** 

###### **Carton Label** 

###### **↓** 

**Master Carton** 

###### **EPS Box Label** 

###### **↓** 

###### **Fresh Export** 

###### **Templates define:** 

- **Paper size** 

- **QR location** 

- **Text fields** 

- **Barcode type** 

- **Logo placement** 

## **14.16 Label History** 

**Every label maintains a complete history.** 

###### **Examples:** 

- **Created** 

- **Printed** 

- **Failed** 

- **Reprinted** 

- **Cancelled (if applicable)** 

###### **Nothing is permanently deleted.** 

## **14.17 Exception Handling** 

**Printer Offline** 

**Request enters Pending Label Queue.** 

**Paper Finished** 

**Printing paused until paper is replaced.** 

###### **Ribbon Finished** 

**Printing paused.** 

###### **Communication Error** 

**Operator retries.** 

###### **Wrong Printer Selected** 

###### **Operator changes printer.** 

###### **Reprint performed.** 

###### **Damaged Label** 

###### **Manager may authorize reprint.** 

###### **Original identity remains unchanged.** 

## **14.18 Audit Trail** 

###### **Every print event records:** 

- **Label ID** 

- **Object Type** 

- **Object ID** 

- **Printer** 

- **Operator** 

- **Workstation** 

- **Print Time** 

- **Reprint Count** 

- **Print Status** 

- **Failure Reason** 

- **Manager Override** 

###### **The audit trail is immutable.** 

## **14.19 Business Rules** 

- **Every label belongs to exactly one business object.** 

- **Labels never create business identities; they represent existing identities.** 

- **Reprints always use the same serial number and QR code.** 

- **Duplicate identities are prohibited.** 

- **Failed prints enter the Pending Label Queue.** 

- **● Label templates are configurable.** 

- **Printers are assigned by workstation.** 

- **Every print and reprint is permanently logged.** 

- **Unlabeled cartons and shipping boxes must remain at the printing station until labeled.** 

- **Labels cannot be manually edited after creation.** 

## **14.20 End-to-End Example** 

**Carton Completed** 

###### **↓** 

###### **Create Label Request** 

###### **↓** 

###### **Generate Label** 

###### **↓** 

###### **Send to Printer** 

###### **↓** 

###### **Printer Out of Labels** 

**↓** 

###### **Pending Label Queue** 

###### **↓** 

###### **Operator Replaces Roll** 

###### **↓** 

###### **Reprint** 

###### **↓** 

###### **Attach Label** 

###### **↓** 

###### **Carton Released** 

###### **↓** 

###### **Audit Updated** 

## **14.21 Workflow Summary** 

**The Label Printing Workflow provides centralized control over all barcode labels used throughout the factory. It guarantees that every label represents a single business object, prevents duplicate identities, supports automatic and manual printing, and records every print event for auditing. Combined with the operational rule that unlabeled objects remain at the printing station, the workflow delivers a simple yet highly reliable labeling process suitable for Version 1 without introducing unnecessary system complexity.** 

## **15 Reprint Workflow** 

## **15.1 Purpose** 

**The Reprint Workflow manages the controlled reprinting of labels that have already been generated by the system.** 

**Unlike the Label Printing Workflow, which creates the initial label, the Reprint Workflow is responsible only for producing an additional copy of an existing label.** 

###### **Its objectives are to:** 

- **Recover from printer failures.** 

- **Replace damaged labels.** 

- **Prevent duplicate identities.** 

- **Maintain complete auditability.** 

- **Ensure labels are attached to the correct physical object.** 

## **15.2 Business Objectives** 

**The Reprint Workflow ensures that:** 

- **No new serial number is ever created.** 

- **The original label data is preserved.** 

- **Every reprint is fully audited.** 

- **Reprints require appropriate authorization when necessary.** 

- **Wrong-label incidents are prevented.** 

## **15.3 Workflow Overview** 

**Existing Business Object** 

- **│** 

- 

###### **Search / Scan Object** 

**│** 

**▼** 

###### **Retrieve Original Label** 

- **│** 

- 

###### **Validate Eligibility** 

**│** 

- 

###### **Print Exact Copy** 

**│** 

- 

###### **Attach Label** 

- **│** 

**▼** 

###### **Update Audit History** 

## **15.4 Supported Objects** 

###### **Labels may be reprinted for:** 

- **Basket** 

- **Tray** 

- **Retail Package** 

- **Carton** 

- **EPS Shipping Box** 

- **Pallet** 

- **Shipment Label (Optional)** 

###### **Only objects that already possess an official label may be reprinted.** 

## **15.5 Starting the Workflow** 

**The operator opens:** 

**Label Reprint** 

###### **The object is selected by:** 

- **QR Scan** 

- **Barcode Scan** 

- **Object Number Search** 

###### **Example:** 

**CT-1025** 

**or** 

**PK-300145** 

## **15.6 Eligibility Validation** 

**Before printing, the system verifies:** 

- **Object exists.** 

- **Original label exists.** 

- **Object is active.** 

- **Object has not been deleted.** 

- **User has permission.** 

###### **If validation fails, reprinting is blocked.** 

## **15.7 Retrieve Original Label** 

**The system retrieves the original label record.** 

###### **This includes:** 

- **QR Code** 

- **Barcode** 

- **Serial Number** 

- **Product Information** 

- **Weight** 

- **Production Date** 

- **Expiry Date** 

- **Template Version** 

###### **No new data is generated.** 

## **15.8 Printing** 

**The system sends the exact same label to the selected printer.** 

**Example:** 

###### **Original Label** 

###### **↓** 

###### **Reprint** 

###### **↓** 

###### **Identical Copy** 

###### **Everything remains identical:** 

- **QR Code** 

- **Barcode** 

- **Serial Number** 

- **Lot Number** 

- **Product Data** 

## **15.9 Identity Protection** 

**A reprint never creates:** 

- **New Package** 

- **New Carton** 

- **New Batch** 

- **New Shipment** 

###### **The label represents the existing business object only.** 

## **15.10 Authorization Rules** 

**Some labels may be reprinted by operators.** 

###### **Examples:** 

- **Basket** 

- **Tray** 

###### **Other labels may require supervisor approval.** 

###### **Examples:** 

- **Retail Package** 

- **Carton** 

- **EPS Shipping Box** 

**Approval rules are configurable.** 

## **15.11 Common Reprint Reasons** 

**The operator selects one reason.** 

###### **Examples:** 

- **Printer Error** 

- **Paper Finished** 

- **Ribbon Finished** 

- **Damaged Label** 

- **Lost Label** 

- **Poor Print Quality** 

- **Customer Request** 

- **Other** 

###### **The selected reason becomes part of the audit trail.** 

## **15.12 Pending Label Queue** 

**If the object is already in the Pending Label Queue, the operator may reprint directly from the queue.** 

###### **The queue displays:** 

- **Object ID** 

- **Label Type** 

- **Time Waiting** 

- **Failure Reason** 

- **Assigned Workstation** 

## **15.13 Physical Verification** 

**Before attaching a reprinted label:** 

**The operator confirms that the physical object matches the object being reprinted.** 

**Example:** 

**Carton:** 

**CT-1025** 

###### **↓** 

###### **Reprint** 

###### **↓** 

###### **Attach Immediately** 

**Version 1 requires reprinted labels to be attached before the object leaves the workstation whenever possible.** 

## **15.14 Reprint Counter** 

**Every label maintains a reprint count.** 

**Example:** 

**Original Print** 

###### **↓** 

**Reprint #1** 

###### **↓** 

**Reprint #2** 

###### **↓** 

**Reprint #3** 

**The counter is never reset.** 

## **15.15 Excessive Reprints** 

**If the number of reprints exceeds the configured threshold:** 

###### **Example:** 

**More than 5 reprints** 

**The system creates a management warning.** 

**Printing is still allowed unless restricted by configuration.** 

## **15.16 Exception Handling** 

**Object Not Found** 

**Reprint blocked.** 

###### **Original Label Missing** 

**Reprint impossible.** 

**Manager review required.** 

###### **Printer Offline** 

**Request remains pending.** 

###### **Permission Denied** 

**Operation cancelled.** 

###### **Wrong Object Selected** 

**Operator cancels before printing.** 

**No audit modification occurs except the cancelled request.** 

## **15.17 Audit Trail** 

###### **Every reprint records:** 

- **Reprint ID** 

- **Object Type** 

- **Object ID** 

- **Original Print ID** 

- **Printer** 

- **Operator** 

- **Workstation** 

- **Date** 

- **Time** 

- **Reprint Reason** 

- **Reprint Number** 

- **Approval User (if applicable)** 

###### **Audit history is immutable.** 

## **15.18 Business Rules** 

- **Reprinting never creates a new business identity.** 

- **Every reprint uses the original label data.** 

- **QR codes and serial numbers never change.** 

- **Every reprint requires an existing label.** 

- **Reprint permissions are configurable by label type.** 

- **Every reprint records a reason.** 

- **Every reprint increments the reprint counter.** 

- **Excessive reprints generate management warnings.** 

- **All reprints are permanently audited.** 

## **15.19 End-to-End Example** 

###### **Carton CT-1025** 

**↓** 

###### **Printer Out of Labels** 

###### **↓** 

###### **Pending Label Queue** 

###### **↓** 

###### **Operator Replaces Label Roll** 

###### **↓** 

###### **Search CT-1025** 

###### **↓** 

###### **Select Reason:** 

###### **Printer Error** 

###### **↓** 

###### **Reprint** 

###### **↓** 

###### **Attach Label** 

###### **↓** 

###### **Reprint Counter = 1** 

###### **↓** 

###### **Audit Updated** 

## **15.20 Workflow Summary** 

**The Reprint Workflow provides a secure and controlled method for reproducing existing labels without altering product identity or traceability.** 

**By always retrieving the original label data, enforcing configurable permissions, recording the reason for every reprint, and maintaining a permanent audit history, the workflow eliminates duplicate identities while ensuring operational continuity when labels are damaged, lost, or fail to print. It complements the Label Printing Workflow by focusing exclusively on the controlled reproduction of existing labels rather than the creation of new ones.** 

## **16 Traceability Workflow** 

## **16.1 Purpose** 

**The Traceability Workflow enables the factory to trace any product, package, batch, carton, shipment, or supplier both forward and backward through the entire production lifecycle.** 

**It provides complete product genealogy from supplier to customer while supporting quality investigations, customer complaints, product recalls, and regulatory requirements.** 

**Unlike production workflows, the Traceability Workflow does not modify data. It is a read-only process that analyzes relationships already recorded by the system.** 

## **16.2 Business Objectives** 

**The Traceability Workflow enables users to answer questions such as:** 

- **Which supplier provided this product?** 

- **Which production batches were used?** 

- **Which operators handled it?** 

- **Which machine processed it?** 

- **Which Freeze Dryer Cycle was used?** 

- **Which packages contain this batch?** 

- **Which cartons contain those packages?** 

- **Which shipment delivered them?** 

- **Which customer received them?** 

###### **The objective is to retrieve complete genealogy within seconds.** 

## **16.3 Traceability Principles** 

**The system is built on four fundamental principles:** 

**1. Every physical object has a unique identity. 2. Every production transformation is permanently recorded.** 

###### **3. Parent-child relationships are never deleted.** 

###### **4. Every movement and processing event is auditable.** 

###### **Because of these principles, complete traceability is always available without requiring duplicate data.** 

## **16.4 Workflow Overview** 

###### **Search Object** 

**│** 

**▼** 

###### **Identify Object Type** 

**│** 

**▼** 

###### **Load Genealogy** 

**│** 

**▼** 

###### **Traverse Relationships** 

**│** 

**▼** 

###### **Display Timeline** 

**│** 

**▼** 

###### **Display Parent History** 

**│** 

**▼** 

###### **Display Child History** 

## **16.5 Search Entry Points** 

###### **Traceability may begin from any business object.** 

###### **Examples:** 

- **Supplier** 

- **Receiving Batch** 

- **Basket** 

- **Production Batch** 

- **Tray** 

- **Freeze Dryer Cycle** 

- **Drying Cycle** 

- **Package** 

- **Carton** 

- **EPS Shipping Box** 

- **Shipment** 

- **Customer** 

###### **The user may search using:** 

- **QR Code** 

- **Barcode** 

- **Serial Number** 

- **Batch Number** 

- **Shipment Number** 

- **Supplier Name** 

## **16.6 Backward Traceability** 

**Backward Traceability answers:** 

**"Where did this product come from?"** 

**Example:** 

**Package PK-20015** 

**↓** 

###### **Production Batch PB-510** 

###### **↓** 

###### **Receiving Batch RB-118** 

###### **↓** 

###### **Supplier** 

**↓** 

**Harvest Period** 

###### **The complete production history is displayed.** 

## **16.7 Forward Traceability** 

**Forward Traceability answers:** 

**"Where did this batch go?"** 

**Example:** 

**Receiving Batch RB-118** 

**↓** 

###### **Production Batch PB-510** 

###### **↓** 

###### **Packages** 

###### **↓** 

###### **Cartons** 

###### **↓** 

###### **Shipment** 

###### **↓** 

###### **Customer** 

###### **This capability is essential for product recalls.** 

## **16.8 Batch Genealogy** 

**The genealogy engine records every transformation.** 

**Example:** 

**Receiving Batch RB-101** 

###### **↓** 

###### **Sorting** 

###### **↓** 

###### **PB-201** 

**PB-202** 

###### **↓** 

###### **Packaging** 

###### **↓** 

**PK-001 PK-002 PK-003** 

###### **If batches are merged:** 

**RB-101** 

**+** 

**RB-102** 

**↓** 

###### **PB-310** 

###### **Both parent batches remain permanently linked to PB-310.** 

## **16.9 Processing History** 

**The system displays every production event.** 

###### **Examples:** 

- **Receiving** 

- **Cold Storage** 

- **Sorting** 

- **Washing** 

- **Slicing** 

- **Freezing** 

- **Freeze Drying** 

- **Conventional Drying** 

- **Packaging** 

- **Shipping** 

###### **Each event includes:** 

- **Date** 

- **Time** 

- **Operator** 

- **Workstation** 

- **Machine (if applicable)** 

## **16.10 Inventory History** 

**Users may view every movement.** 

**Example:** 

###### **Receiving** 

###### **↓** 

###### **Cold Storage** 

###### **↓** 

###### **Sorting** 

###### **↓** 

###### **Packaging** 

###### **↓** 

###### **Warehouse** 

###### **↓** 

###### **Shipment** 

###### **Every movement includes:** 

- **Source Location** 

- **Destination** 

- **Time** 

- **Operator** 

## **16.11 Machine History** 

###### **Where applicable, the system displays:** 

- **Freezer** 

- **Freeze Dryer** 

- **Conventional Dryer** 

###### **Including:** 

- **Cycle Number** 

- **Start Time** 

- **End Time** 

- **Operator** 

###### **Version 1 does not display machine operating parameters.** 

## **16.12 Packaging History** 

**From any package the system displays:** 

**Package** 

###### **↓** 

###### **Carton** 

**↓** 

###### **Shipment** 

**↓** 

###### **Customer** 

###### **Conversely, from any carton the system displays:** 

- **All packages** 

- **Production Batches** 

- **Receiving Batches** 

- **Suppliers** 

## **16.13 Supplier Traceability** 

###### **Searching by supplier displays:** 

- **Receiving Batches** 

- **Production Batches** 

- **Packages** 

- **Shipments** 

- **Customers** 

###### **This supports supplier quality investigations.** 

## **16.14 Customer Traceability** 

###### **Searching by customer displays:** 

- **Shipments** 

- **Cartons** 

- **Packages** 

- **Production Batches** 

- **Receiving Batches** 

- **Supplier Contributions** 

###### **This supports complaint investigations.** 

## **16.15 Product Recall Workflow** 

**If a product recall is required:** 

**The manager searches:** 

**Receiving Batch** 

###### **or** 

**Production Batch** 

**The system immediately identifies:** 

- **All packages** 

- **All cartons** 

- **All shipments** 

- **All customers** 

###### **Affected inventory still in the warehouse is also identified.** 

## **16.16 Timeline View** 

**The system presents genealogy as a chronological timeline.** 

**Example:** 

**Receiving** 

**↓** 

**Sorting** 

**↓** 

**Washing** 

###### **↓** 

###### **Slicing** 

###### **↓** 

###### **Freeze Drying** 

###### **↓** 

###### **Packaging** 

###### **↓** 

###### **Shipment** 

###### **Every event is clickable for detailed information.** 

## **16.17 Relationship Graph** 

**Version 1 supports a hierarchical tree view.** 

**Example:** 

**Supplier** 

**↓** 

###### **Receiving Batch** 

###### **↓** 

###### **Production Batch** 

###### **↓** 

###### **Package** 

###### **↓** 

###### **Carton** 

###### **↓** 

###### **Shipment** 

###### **↓** 

###### **Customer** 

###### **Interactive graphical network visualization is outside the scope of Version 1.** 

## **16.18 Exception Handling** 

###### **Object Not Found** 

**No matching object exists.** 

**Search ends.** 

###### **Archived Shipment** 

###### **Historical information remains fully accessible.** 

###### **Deleted User** 

###### **Historical operator records remain preserved using the operator's historical identity.** 

###### **Missing Parent** 

**Should never occur.** 

###### **If detected, the system creates a critical integrity alert.** 

## **16.19 Audit Trail** 

###### **Every traceability search records:** 

- **User** 

- **Date** 

- **Time** 

- **Search Object** 

- **Search Type** 

###### **The genealogy itself is never modified.** 

## **16.20 Business Rules** 

- **Every traceability operation is read-only.** 

- **Every physical object has one permanent identity.** 

- **Parent-child relationships are immutable.** 

- **Genealogy is never deleted.** 

- **Forward and backward traceability are always available.** 

- **Inventory movement history remains permanently accessible.** 

- **Historical operator and machine information is preserved.** 

- **Traceability includes both production and logistics events.** 

- **Recall analysis must be executable from any Receiving Batch or Production Batch.** 

## **16.21 End-to-End Example** 

**Customer Complaint** 

###### **↓** 

###### **Package QR Scanned** 

###### **↓** 

###### **Package PK-20015** 

###### **↓** 

###### **Production Batch PB-510** 

###### **↓** 

###### **Receiving Batch RB-118** 

###### **↓** 

###### **Supplier Identified** 

###### **↓** 

###### **Freeze Dryer Cycle FDC-145** 

###### **↓** 

###### **Carton CT-420** 

###### **↓** 

###### **Shipment SH-208** 

###### **↓** 

###### **Customer Confirmed** 

###### **↓** 

###### **Complete History Displayed** 

## **16.22 Workflow Summary** 

**The Traceability Workflow is the core intelligence layer of the system. Rather than creating or modifying operational data, it reconstructs the complete lifecycle of any product by traversing the relationships recorded throughout production, inventory, packaging, and shipping.** 

**By supporting forward and backward traceability, preserving immutable genealogy, and enabling rapid recall analysis from any point in the supply chain, the workflow provides full regulatory compliance and operational transparency while remaining lightweight and practical for Version 1.** 

## **17 Exception Workflow** 

## **17.1 Purpose** 

**The Exception Workflow manages abnormal situations that occur during daily factory operations.** 

**Unlike production workflows, an Exception does not represent a business process. It represents an event that requires attention because something unexpected has occurred.** 

###### **The objectives are to:** 

- **Record operational issues.** 

- **Notify responsible personnel.** 

- **Prevent data inconsistency.** 

- **Minimize production interruptions.** 

- **Maintain a complete audit history.** 

- **Support management decision-making.** 

###### **Version 1 is designed to warn rather than block operations whenever possible. Only exceptions that could compromise traceability or inventory integrity prevent workflow completion.** 

## **17.2 Business Objectives** 

**The Exception Workflow enables the factory to:** 

- **Detect abnormal events.** 

- **Record their details.** 

- **Assign responsibility.** 

- **Track resolution.** 

- **Preserve complete operational history.** 

###### **Exceptions become management tasks rather than production transactions.** 

## **17.3 Exception Categories** 

###### **The system classifies exceptions into configurable categories.** 

###### **Examples:** 

###### **Inventory** 

- **Missing Basket** 

- **Missing Tray** 

- **Missing Carton** 

- **Wrong Location** 

- **Duplicate Scan** 

###### **Production** 

- **Machine Failure** 

- **Interrupted Cycle** 

- **Incorrect Destination** 

- **Yield Outside Limits** 

- **Weight Outside Tolerance** 

###### **Labeling** 

- **Printer Offline** 

- **Paper Finished** 

- **Pending Label** 

- **Duplicate Print Request** 

###### **Quality** 

- **Damaged Product** 

- **Contamination** 

- **Foreign Material** 

- **Packaging Defect** 

###### **Shipping** 

- **Wrong Carton** 

- **Missing Shipment Item** 

- **Damaged Carton** 

- **Shipment Delay** 

###### **System** 

- **Network Failure** 

- **Scanner Offline** 

- **Printer Offline** 

- **Database Connection Error** 

## **17.4 Workflow Overview** 

###### **Exception Occurs** 

**│** 

**▼** 

###### **Detect Exception** 

**│** 

**▼** 

###### **Create Exception Record** 

**│** 

**▼** 

###### **Assign Priority** 

**│** 

**▼** 

###### **Assign Responsible User** 

**│** 

**▼** 

###### **Resolve** 

**│** 

**▼** 

###### **Close Exception** 

## **17.5 Exception Sources** 

###### **Exceptions may originate from:** 

- **Operator Actions** 

- **Automatic System Validation** 

- **Machine Events (manual entry in Version 1)** 

- **Inventory Verification** 

- **Manager Review** 

###### **Every exception has a single source.** 

## **17.6 Automatic Detection** 

###### **The system automatically creates exceptions for situations such as:** 

- **Invalid QR Code** 

- **Duplicate Scan** 

- **Invalid Workflow Transition** 

- **Missing Inventory Object** 

- **Weight Outside Configured Limits** 

- **Yield Outside Configured Limits** 

- **Excessive Label Reprints** 

###### **These exceptions require no manual data entry.** 

## **17.7 Manual Reporting** 

**Operators may manually report issues.** 

###### **Examples:** 

- **Damaged Basket** 

- **Broken Tray** 

- **Product Contamination** 

- **Equipment Malfunction** 

- **Packaging Damage** 

###### **The operator selects:** 

- **Exception Type** 

- **Description** 

- **Optional Photo (future version)** 

###### **Version 1 stores text descriptions only.** 

## **17.8 Exception Severity** 

**Each exception has one severity level.** 

**S Description e v e r i t y L Informational issue o w M Requires supervisor attention e d i u m H Production may continue, but prompt action is i recommended g h** 

**C Traceability or inventory integrity is at risk r i t i c a l** 

**Severity levels are configurable.** 

## **17.9 Blocking Rules** 

**Version 1 follows a Warning First philosophy.** 

**The system blocks operations only when continuing would compromise:** 

- **Product Identity** 

- **Batch Genealogy** 

- **Inventory Integrity** 

- **Shipment Accuracy** 

###### **Everything else produces warnings.** 

###### **Examples:** 

###### **Warning** 

- **Low production yield** 

- **High production yield** 

- **Damaged basket** 

- **Printer out of labels** 

- **Machine maintenance overdue** 

###### **Blocking** 

- **Unknown QR Code** 

- **Duplicate Package Serial** 

- **Missing Production Batch** 

- **Invalid Status Transition** 

- **Wrong Shipment Carton** 

## **17.10 Assignment** 

###### **Every exception may be assigned to:** 

- **Production Supervisor** 

- **Warehouse Supervisor** 

- **Quality Manager** 

- **Maintenance** 

- **System Administrator** 

###### **Assignments are configurable.** 

## **17.11 Resolution Workflow** 

**Each exception progresses through defined statuses.** 

**Open** 

###### **↓** 

###### **Assigned** 

###### **↓** 

###### **In Progress** 

**↓** 

###### **Resolved** 

**↓** 

###### **Closed** 

###### **Only authorized users may close exceptions.** 

## **17.12 Root Cause** 

**Before closure, the responsible user may record:** 

- **Root Cause** 

- **Corrective Action** 

- **Preventive Action** 

**These fields are optional in Version 1 but strongly recommended for continuous improvement.** 

## **17.13 Notifications** 

**The system displays open exceptions in:** 

- **My Tasks** 

- **Supervisor Dashboard** 

- **Manager Dashboard** 

###### **Version 1 provides in-system notifications only.** 

**Email and SMS notifications are outside the project scope.** 

## **17.14 Related Objects** 

**Every exception may be linked to one or more business objects.** 

###### **Examples:** 

- **Basket** 

- **Tray** 

- **Production Batch** 

- **Carton** 

- **Shipment** 

- **Machine** 

- **Supplier** 

- **Customer** 

###### **This allows users to investigate the issue directly from the related object.** 

## **17.15 Exception Search** 

###### **Managers may search exceptions by:** 

- **Status** 

- **Severity** 

- **Date** 

- **Operator** 

- **Machine** 

- **Product** 

- **Production Batch** 

- **Shipment** 

- **Responsible User** 

###### **Historical exceptions remain permanently searchable.** 

## **17.16 Exception Dashboard** 

###### **The management dashboard displays:** 

- **Open Exceptions** 

- **Critical Exceptions** 

- **Overdue Exceptions** 

- **Exceptions by Category** 

- **Exceptions by Production Area** 

###### **This provides immediate visibility into operational issues.** 

## **17.17 Audit Trail** 

###### **Every exception records:** 

- **Exception ID** 

- **Category** 

- **Severity** 

- **Related Object** 

- **Description** 

- **Creator** 

- **Assigned User** 

- **Creation Time** 

- **Resolution Time** 

- **Root Cause** 

- **Corrective Action** 

- **Closure User** 

###### **The history is immutable.** 

## **17.18 Business Rules** 

- **Every exception has a unique ID.** 

- **Every exception belongs to one category.** 

- **Every exception has one severity level.** 

- **Exceptions never modify business data directly.** 

- **Blocking occurs only when traceability or inventory integrity would be compromised.** 

- **Warning-level exceptions allow production to continue.** 

- **Every exception is permanently audited.** 

- **Closed exceptions cannot be deleted.** 

- **Resolution responsibility is configurable.** 

- **Historical exception data is always available for reporting.** 

## **17.19 End-to-End Example** 

**Packaging Operator** 

###### **↓** 

**Package Weight = 19.1 g** 

###### **Target = 20 g** 

###### **Tolerance = ±0.5 g** 

###### **↓** 

###### **System Detects** 

###### **Weight Outside Tolerance** 

###### **↓** 

###### **Create Exception** 

###### **↓** 

###### **Severity:** 

###### **Medium** 

###### **↓** 

###### **Operator Corrects Package** 

###### **↓** 

###### **Supervisor Reviews** 

###### **↓** 

###### **Resolved** 

###### **↓** 

###### **Closed** 

###### **↓** 

###### **Audit Updated** 

## **17.20 Exception Priority Matrix** 

**S Typical Blocks e Action Workflow v e r i t y L Log only No o w M Supervisor No e review d** 



<!-- Start of picture text -->
i<br>u<br>m<br>H Immediate  Usually<br>i attention No<br>g<br>h<br>C Manager  Yes<br>r interventio<br>i n<br>t<br>i<br>c<br>a<br>l<br><!-- End of picture text -->

**This matrix can be adjusted through system configuration.** 

## **17.21 Workflow Summary** 

**The Exception Workflow provides a centralized mechanism for detecting, recording, assigning, and resolving operational issues across the entire factory.** 

**By separating exceptions from normal production workflows, adopting a warningfirst philosophy, and blocking operations only when traceability, inventory integrity, or shipment accuracy is at risk, the system remains practical for daily operations while maintaining high data quality. Every exception is permanently linked to the relevant business objects, creating a comprehensive operational history that supports continuous improvement, audits, and management decision-making.** 

## **18 Manager Override Workflow** 

## **18.1 Purpose** 

**The Manager Override Workflow provides authorized managers with a controlled mechanism to override standard system rules when exceptional business situations require immediate action.** 

**The purpose of an override is not to bypass traceability or compromise data integrity. Instead, it allows business continuity while ensuring that every override is fully documented, justified, and permanently auditable.** 

**Manager Overrides are exceptional events and should occur infrequently.** 

## **18.2 Business Objectives** 

**The Manager Override Workflow enables authorized users to:** 

- **Resolve operational deadlocks.** 

- **Continue production during exceptional circumstances.** 

- **Correct operational mistakes.** 

- **Handle emergency situations.** 

- **Preserve complete auditability.** 

- **● Maintain business continuity without sacrificing traceability.** 

## **18.3 Override Principles** 

**The system follows five core principles:** 

**1. Only authorized roles may perform overrides. 2. Every override requires a reason. 3. Every override is permanently audited.** 

**4. Overrides never delete historical data.** 

**5. Overrides cannot break product genealogy.** 

###### **These principles are mandatory throughout the system.** 

## **18.4 Workflow Overview** 

###### **Operator Requests Help** 

**│** 

**▼** 

**Manager Reviews Situation** 

**│** 

**▼** 

###### **Validate Override Permission** 

**│** 

**▼** 

###### **Enter Override Reason** 

**│** 

**▼** 

###### **Execute Override** 

**│** 

**▼** 

###### **Record Audit Trail** 

**│** 

**▼** 

###### **Continue Workflow** 

## **18.5 Authorized Roles** 

###### **Only designated users may perform overrides.** 

###### **Typical roles include:** 

- **Factory Manager** 

- **Production Manager** 

- **Warehouse Manager** 

- **Quality Manager** 

- **System Administrator (system-related overrides only)** 

###### **Permissions are configurable through the Role Management module.** 

## **18.6 Common Override Scenarios** 

###### **Examples include:** 

###### **Inventory** 

- **Correct an incorrect warehouse location.** 

- **Unlock inventory after an interrupted operation.** 

- **● Reassign inventory to another workflow.** 

###### **Production** 

- **Restart an interrupted production cycle.** 

- **Cancel an incomplete cycle.** 

- **Reassign trays to another machine.** 

- **Continue production after equipment replacement.** 

###### **Packaging** 

- **Reopen a completed carton.** 

- **Replace damaged packages.** 

- **Force carton completion after manual verification.** 

###### **Shipping** 

- **Replace a damaged carton.** 

- **Remove a carton from a shipment.** 

- **Approve a partial shipment.** 

###### **Labeling** 

- **Force label reprint after repeated failures.** 

- **Approve printing on an alternate workstation.** 

###### **System** 

- **Release locked sessions.** 

- **Resolve orphaned workflow states.** 

- **Correct synchronization issues.** 

## **18.7 Override Request** 

**Most overrides begin when an operator cannot continue because the system has blocked an action.** 

**Example:** 

**Operator** 

**↓** 

**Workflow Blocked** 

**↓** 

**Request Manager** 

**↓** 

###### **Manager Login** 

**↓** 

###### **Override Approved** 

## **18.8 Manager Authentication** 

**Before executing an override:** 

**The manager must authenticate using their own credentials.** 

**Operator credentials cannot be reused.** 

**This ensures accountability.** 

## **18.9 Override Reason** 

**Every override requires a mandatory reason.** 

###### **Examples:** 

- **Equipment Failure** 

- **Emergency Shipment** 

- **Incorrect Scan** 

- **Damaged Packaging** 

- **Customer Priority** 

- **Human Error** 

- **Inventory Correction** 

- **Other** 

###### **The reason becomes part of the permanent audit record.** 

## **18.10 Override Validation** 

**The system validates:** 

- **Manager permission.** 

- **Override type.** 

- **Object status.** 

- **Current workflow state.** 

###### **Overrides that would compromise traceability are always rejected.** 

###### **Examples of prohibited actions:** 

- **Deleting a Production Batch.** 

- **Changing Package Serial Numbers.** 

- **Modifying Shipment History.** 

- **Removing genealogy links.** 

## **18.11 Allowed Override Actions** 

**Examples of permitted actions include:** 

- **Unlock Inventory** 

- **Change Task Priority** 

- **Reassign Operator** 

- **Reassign Machine** 

- **Reopen Carton** 

- **Approve Partial Shipment** 

- **Correct Inventory Location** 

- **Restart Interrupted Cycle** 

###### **These actions modify workflow state without altering historical records.** 

## **18.12 Audit Trail** 

**Every override records:** 

- **Override ID** 

- **Manager** 

- **Operator (if applicable)** 

- **Object Type** 

- **Object ID** 

- **Override Type** 

- **Reason** 

- **Date** 

- **Time** 

- **Before State** 

- **After State** 

###### **Nothing is overwritten.** 

## **18.13 Notifications** 

###### **Completed overrides appear on:** 

- **Manager Dashboard** 

- **Audit Reports** 

- **Related Business Object History** 

###### **This ensures visibility during audits and investigations.** 

## **18.14 Override Limits** 

**Version 1 intentionally limits override capabilities.** 

###### **Managers cannot:** 

- **Delete inventory.** 

- **Delete production batches.** 

- **Delete shipments.** 

- **Modify genealogy.** 

- **Change historical timestamps.** 

- **Edit audit records.** 

- **Reuse serial numbers.** 

###### **These restrictions protect data integrity.** 

## **18.15 Emergency Overrides** 

###### **In exceptional circumstances, managers may execute an emergency override.** 

###### **Examples:** 

- **Cold room failure.** 

- **Power outage.** 

- **Equipment breakdown.** 

- **Export deadline.** 

###### **Emergency overrides require:** 

- **Mandatory justification.** 

- **Immediate audit entry.** 

- **Post-event management review.** 

## **18.16 Exception Integration** 

**Many overrides originate from open exceptions.** 

**Example:** 

**Exception** 

###### **↓** 

**Manager Review** 

###### **↓** 

###### **Override** 

**↓** 

**Exception Resolved** 

**↓** 

###### **Workflow Continues** 

###### **This links operational incidents with management decisions.** 

## **18.17 Business Rules** 

- **Only authorized managers may execute overrides.** 

- **Every override requires authentication.** 

- **Every override requires a reason.** 

- **Overrides never delete historical information.** 

- **Product genealogy cannot be modified.** 

- **Every override is permanently audited.** 

- **Historical workflow states remain accessible.** 

- **Emergency overrides require additional justification.** 

- **Override permissions are configurable by role.** 

## **18.18 End-to-End Example** 

**Freeze Dryer Stops** 

**↓** 

**Cycle Interrupted** 

**↓** 

**Operator Cannot Continue** 

###### **↓** 

###### **Production Manager Reviews** 

###### **↓** 

###### **Reason:** 

###### **Equipment Failure** 

###### **↓** 

###### **Restart Cycle Approved** 

###### **↓** 

###### **Override Executed** 

###### **↓** 

###### **Audit Recorded** 

###### **↓** 

###### **Production Continues** 

## **18.19 Override vs Normal Workflow** 

**Normal Workflow Manager Override** 

**Follows standard Used only in exceptional situations business rules** 

**No special approval Requires authorized manager required authentication** 

**Automatic validation Additional validation and justification required Routine production Exceptional management action activity Standard audit Enhanced audit including reason and before/after state** 

## **18.20 Workflow Summary** 

**The Manager Override Workflow provides a controlled mechanism for handling exceptional operational situations without compromising system integrity.** 

**By requiring manager authentication, mandatory justification, configurable permissions, and immutable audit records, the workflow allows production to continue during emergencies while preserving complete traceability and accountability. Most importantly, overrides can modify workflow execution but can never alter product identity, batch genealogy, or historical records, ensuring that operational flexibility never comes at the expense of data integrity.** 

## **19 Session Workflow** 

## **19.1 Purpose** 

**The Session Workflow provides a standardized mechanism for managing operator work throughout the factory.** 

**Rather than allowing operators to perform actions at any time, every operational activity is executed within a Session. A Session represents a continuous period of work performed by one operator on one workstation or mobile device while performing a specific business function.** 

###### **This approach provides:** 

- **Operational accountability.** 

- **Clear work ownership.** 

- **Simplified task management.** 

- **Complete activity history.** 

- **Better recovery after interruptions.** 

- **Consistent behavior across all production modules.** 

###### **Sessions are a core architectural concept of the system.** 

## **19.2 Business Objectives** 

**The Session Workflow enables the factory to:** 

- **Track who is performing each operation.** 

- **Associate every action with a workstation or mobile device.** 

- **Organize work into logical activities.** 

- **Support pause and resume operations.** 

- **Recover safely after unexpected interruptions.** 

- **Prevent conflicting operations on the same inventory.** 

## **19.3 Session Principles** 

**Every session follows these principles:** 

**1. A session belongs to one operator.** 

**2. A session is executed on one device.** 

**3. A session has one operational role.** 

**4. A session may contain many business transactions.** 

**5. Every transaction references its parent session.** 

**6. Sessions never modify business rules; they only group operational activities.** 

## **19.4 Workflow Overview** 

###### **User Login** 

- **│** 

- 

###### **Select Role** 

- **│** 

- 

###### **Open Session** 

- **│** 

- 

###### **Receive Tasks** 

- **│** 

- 

###### **Perform Operations** 

- **│** 

- 

###### **Pause / Resume (Optional)** 

- **│** 

- 

###### **Close Session** 

**│** 

**▼** 

###### **Archive Session** 

## **19.5 Session Creation** 

**A session begins after:** 

**1. User authentication.** 

**2. Device identification.** 

**3. Role selection.** 

###### **Example:** 

###### **Login** 

###### **↓** 

###### **Terminal:** 

###### **Android PDA-03** 

###### **↓** 

**Role:** 

###### **Washing Operator** 

###### **↓** 

###### **Session Created** 

###### **The system generates a unique Session ID.** 

## **19.6 Session Types** 

**Sessions are role-based rather than workflow-based.** 

###### **Examples include:** 

- **Receiving** 

- **Cold Storage** 

- **Sorting** 

- **Washing** 

- **Slicing** 

- **Freezing** 

- **Freeze Drying** 

- **Conventional Drying** 

- **Packaging** 

- **Warehouse Movement** 

- **Shipping** 

- **Quality Control** 

- **Maintenance** 

- **Management** 

**New session types can be added through configuration without modifying the database structure.** 

## **19.7 Device Independence** 

**A session may be created from any supported terminal.** 

**Examples:** 

###### **Fixed Workstation** 

- **Raspberry Pi** 

- **Barcode Scanner** 

- **Digital Scale** 

- **Label Printer** 

###### **Used for:** 

- **Receiving** 

- **Packaging** 

- **Weighing** 

- **Label Printing** 

###### **Mobile PDA** 

###### **Industrial Android Scanner** 

###### **Used for:** 

- **Inventory Movement** 

- **Washing** 

- **Sorting** 

- **Picking** 

- **Shipping** 

- **Warehouse Operations** 

###### **The business logic remains identical regardless of device type.** 

## **19.8 Role Selection** 

###### **Immediately after login, the operator selects the activity they intend to perform.** 

**Example:** 

**Login** 

**↓** 

**Select Role** 

**↓** 

**Packaging** 

###### **↓** 

###### **Session Started** 

###### **The selected role determines:** 

- **Available menus.** 

- **My Tasks.** 

- **Scan behavior.** 

- **Allowed operations.** 

###### **This design allows any terminal to temporarily assume different responsibilities if another device becomes unavailable.** 

## **19.9 My Tasks Integration** 

**When a session starts, the system automatically loads:** 

**My Tasks** 

**Examples:** 

**Receiving:** 

- **Receive Supplier Delivery** 

###### **Packaging:** 

- **Package Production Batch PB-520** 

###### **Shipping:** 

- **Pick Cartons for Shipment SH-301** 

###### **Managers may also assign additional tasks during an active session.** 

## **19.10 Scan-Driven Operation** 

**Operators are not required to navigate complex menus. At any time during a session they may simply scan an object.** 

**Example:** 

###### **Packaging Session** 

###### **↓** 

###### **Scan Production Batch** 

###### **↓** 

###### **System Displays:** 

###### **Ready for Packaging** 

###### **↓** 

###### **Begin Packaging** 

###### **The system determines the correct workflow based on:** 

- **Current session role.** 

- **Object type.** 

- **Object status.** 

## **19.11 Session Locking** 

**To prevent conflicting operations:** 

###### **When an object becomes part of an active session, it may be temporarily locked.** 

###### **Examples:** 

- **Production Batch** 

- **Carton** 

- **Shipment** 

- **Inventory Movement** 

**Other sessions cannot modify the locked object until it is released or the session is closed.** 

## **19.12 Pause and Resume** 

**Sessions may be paused.** 

###### **Reasons include:** 

- **Break** 

- **Equipment Maintenance** 

- **Shift Change** 

- **Network Interruption** 

###### **When resumed:** 

- **Pending tasks remain available.** 

- **Object locks are restored where appropriate.** 

- **Workflow continues from the last completed step.** 

## **19.13 Shift Handover** 

**If a shift ends before completion:** 

**The supervisor may transfer the session.** 

**Example:** 

**Operator A** 

**↓** 

###### **Pause Session** 

###### **↓** 

###### **Supervisor Approval** 

###### **↓** 

###### **Operator B** 

###### **↓** 

###### **Resume Session** 

###### **The audit trail records both operators.** 

## **19.14 Automatic Recovery** 

**If a device loses power or network connectivity:** 

**Upon the next login, the system checks for unfinished sessions.** 

###### **The user may:** 

- **Resume the previous session.** 

- **Close it (with authorization if required).** 

- **Create a new session.** 

###### **No completed transactions are lost.** 

## **19.15 Session Timeout** 

**Inactive sessions automatically expire after a configurable period.** 

**Example:** 

**30 minutes without activity.** 

###### **When timed out:** 

- **The session is closed or suspended according to configuration.** 

- **Temporary object locks are released.** 

- **The user must log in again.** 

## **19.16 Session Closure** 

###### **A session ends when:** 

- **The operator chooses End Session.** 

- **Shift ends.** 

- **Automatic timeout occurs.** 

- **Manager closes the session.** 

###### **Closing a session:** 

- **Releases temporary locks.** 

- **Completes outstanding task assignments where appropriate.** 

- **Records end time.** 

## **19.17 Audit Trail** 

###### **Every session records:** 

- **Session ID** 

- **Operator** 

- **Device** 

- **Role** 

- **Login Time** 

- **Logout Time** 

- **Pause Time(s)** 

- **Resume Time(s)** 

- **Assigned Tasks** 

- **Completed Transactions** 

- **Related Business Objects** 

- **IP Address (optional)** 

- **Application Version (optional)** 

###### **Session history is immutable.** 

## **19.18 Business Rules** 

- **Every operational transaction belongs to one session.** 

- **A session belongs to one operator.** 

- **A session is associated with one active role.** 

- **Sessions may be paused and resumed.** 

- **Session roles determine available operations.** 

- **Scan behavior depends on both the current role and the scanned object.** 

- **Temporary object locks prevent conflicting updates.** 

- **Sessions automatically recover after unexpected interruptions.** 

- **Session timeout is configurable.** 

- **Every session is permanently audited.** 

## **19.19 End-to-End Example** 

###### **Operator Login** 

###### **↓** 

###### **Select Role:** 

###### **Packaging** 

###### **↓** 

###### **Packaging Session Created** 

###### **↓** 

###### **My Tasks Loaded** 

###### **↓** 

###### **Scan Production Batch PB-520** 

###### **↓** 

###### **Create Packages** 

###### **↓** 

###### **Create Carton** 

###### **↓** 

###### **Print Label** 

###### **↓** 

###### **Complete Packaging** 

**↓** 

###### **End Session** 

###### **↓** 

###### **Audit Saved** 

## **19.20 Relationship with Other Workflows** 

**The Session Workflow is not an independent production process. It acts as the operational container for all business workflows.** 

###### **For example:** 

- **Receiving Workflow executes inside a Receiving Session.** 

- **Washing Workflow executes inside a Washing Session.** 

- **Packaging Workflow executes inside a Packaging Session.** 

- **Shipping Workflow executes inside a Shipping Session.** 

**This shared model provides a consistent user experience and a unified audit structure across the entire application.** 

## **19.21 Workflow Summary** 

**The Session Workflow is the operational foundation of the system, ensuring that every user action is performed within a structured, role-based working context.** 

**By combining user authentication, device identification, role selection, task management, scan-driven operations, pause/resume capabilities, and automatic recovery, the Session Workflow creates a consistent execution model for both fixed workstations and mobile Android scanners. It improves accountability, prevents conflicting operations, simplifies daily factory work, and provides a comprehensive audit trail for every activity performed throughout the production lifecycle.** 

## **20 Task Workflow** 

## **20.1 Purpose** 

**The Task Workflow manages all work assigned to users throughout the factory.** 

**Rather than requiring operators to decide what to do next, the system automatically generates tasks based on business events and workflow completion. Operators simply open My Tasks or scan an object, and the system guides them to the correct operation.** 

###### **The objectives are to:** 

- **Automatically distribute work.** 

- **Reduce operator decision-making.** 

- **Prioritize production.** 

- **Balance workloads.** 

- **Track task execution.** 

- **Provide complete operational visibility.** 

**Tasks are operational instructions only. They do not change business data until the associated workflow is completed.** 

## **20.2 Business Objectives** 

**The Task Workflow enables the factory to:** 

- **Automatically create work items.** 

- **Assign tasks to the appropriate role.** 

- **Prioritize urgent operations.** 

- **Monitor work progress.** 

- **Prevent forgotten inventory.** 

- **Improve production flow.** 

## **20.3 Task Principles** 

**The system follows these principles:** 

###### **1. Tasks are generated automatically whenever possible. 2. A task belongs to a business object.** 

**3. A task is assigned to a role, not initially to a specific user.** 

**4. A user claims a task by starting work.** 

**5. Completing the workflow automatically completes the task.** 

**6. Tasks never replace business rules; they simply organize work.** 

## **20.4 Workflow Overview** 

###### **Business Event** 

**│** 

- 

###### **Generate Task** 

**│** 

- 

###### **Assign Role** 

- **│** 

- 

###### **Place in Queue** 

- **│** 

- 

###### **Operator Claims Task** 

- **│** 

- 

###### **Execute Workflow** 

- **│** 

- 

###### **Complete Task** 

## **20.5 Automatic Task Generation** 

**Tasks are created automatically after specific business events.** 

###### **Examples:** 

|**Business Event**|**Generated**<br>**Task**|
|---|---|
|**Receiving completed**|**Move to Cold**<br>**Storage**|
|**Cold Storage**<br>**complete**|**Sorting**|
|**Sorting complete**|**Fresh Export**|
|**(Fresh Export)**|**Packing**|
|**Sorting complete**<br>**(Processing)**|**Washing**|
|**Washing complete**|**Slicing**|
|**Slicing complete**|**Freezing**|
|**Freezing complete**|**Freeze Drying**|
|**Freeze Drying**<br>**complete**|**Packaging**|
|**Conventional Drying**<br>**complete**|**Packaging**|
|**Packaging complete**|**Move to**|



###### **Finished Goods** 

###### **Sales Order approved** 

###### **Picking & Shipping** 

###### **This eliminates manual scheduling for routine operations.** 

## **20.6 Task Types** 

###### **Typical task types include:** 

- **Receiving** 

- **Internal Transfer** 

- **Sorting** 

- **Washing** 

- **Slicing** 

- **Freezing** 

- **Freeze Drying** 

- **Conventional Drying** 

- **Packaging** 

- **Inventory Movement** 

- **Quality Inspection** 

- **Label Printing** 

- **Shipping** 

- **Exception Resolution** 

- **Maintenance** 

###### **New task types may be added through configuration.** 

## **20.7 Task Assignment** 

**Tasks are first assigned to a Role.** 

**Examples:** 

**Packaging Task** 

**↓** 

###### **Packaging Operator** 

###### **Shipping Task** 

###### **↓** 

###### **Warehouse Operator** 

###### **Exception** 

###### **↓** 

###### **Quality Manager** 

**When an operator starts the task, ownership changes from the role to that specific user.** 

## **20.8 My Tasks** 

**Every session displays:** 

**My Tasks** 

**The list contains:** 

- **Assigned Tasks** 

- **● Available Role Tasks ● High Priority Tasks ● Overdue Tasks** 

###### **Tasks are refreshed automatically.** 

## **20.9 Scan-Based Task Discovery** 

**Operators are not required to start from My Tasks.** 

**If they scan a valid object, the system determines:** 

- **Current Status** 

- **● Pending Task ● Correct Workflow** 

**Example:** 

###### **Scan Basket** 

###### **↓** 

###### **Status:** 

###### **Ready for Washing** 

###### **↓** 

###### **Open Washing Workflow** 

**This allows experienced operators to work efficiently while still following business rules.** 

## **20.10 Task Priority** 

**Every task has a priority level.** 

**Examples:** 

**P Typical Use r i o r i t y L Routine work o w** 

###### **N Standard production** 

**o r m a l** 

###### **H Urgent production** 

**i g h** 

**C Customer emergency or r quality issue i t i c a l** 

###### **Priority may be changed by authorized managers.** 

## **20.11 Task Ordering** 

**When multiple tasks exist, the system determines execution order using configurable rules.** 

###### **Typical ordering criteria:** 

**1. Manager Priority 2. Product Expiry Risk (FIFO/FEFO where applicable)** 

**3. Creation Time** 

**4. Production Schedule** 

**Example:** 

**A manager may prioritize Basket B-120 for washing because it contains a premium export order, even if another basket was received earlier.** 

## **20.12 Task States** 

**Every task progresses through the following lifecycle:** 

**Created** 

###### **↓** 

###### **Available** 

###### **↓** 

###### **Claimed** 

###### **↓** 

###### **In Progress** 

###### **↓** 

###### **Completed** 

###### **or** 

###### **Cancelled** 

**Only managers may cancel completed tasks.** 

## **20.13 Task Ownership** 

**When an operator claims a task:** 

###### **The task records:** 

- **Operator** 

- **Device** 

- **Session** 

- **Start Time** 

###### **Ownership remains until:** 

- **Completion** 

- **Manual release** 

- **Supervisor reassignment** 

## **20.14 Reassignment** 

**Managers may reassign tasks.** 

###### **Examples:** 

- **Operator absent** 

- **Equipment unavailable** 

- **Workload balancing** 

- **Priority change** 

###### **The audit trail records:** 

- **Original Assignee** 

- **New Assignee** 

- **Reason** 

## **20.15 Overdue Tasks** 

**Tasks exceeding their expected completion time are marked:** 

###### **Overdue** 

###### **Examples:** 

- **Washing delayed.** 

- **Packaging waiting too long.** 

- **Shipment not prepared.** 

###### **Overdue tasks appear on manager dashboards.** 

## **20.16 Task Dependencies** 

**Some tasks cannot begin until previous tasks are completed.** 

**Example:** 

**Sorting** 

###### **↓** 

**Washing** 

###### **↓** 

**Slicing** 

###### **↓** 

**Freezing** 

**↓** 

###### **Freeze Drying** 

**↓** 

###### **Packaging** 

**The system automatically enforces these dependencies based on object status.** 

## **20.17 Exception Integration** 

**If an exception blocks a workflow:** 

**The associated task becomes:** 

**Blocked** 

**Once the exception is resolved, the task automatically returns to:** 

**Available or In Progress, depending on its previous state.** 

## **20.18 Audit Trail** 

###### **Every task records:** 

- **Task ID** 

- **Task Type** 

- **Business Object** 

- **Assigned Role** 

- **Assigned Operator** 

- **Session** 

- **Priority** 

- **Status** 

- **Start Time** 

- **Completion Time** 

- **Reassignments** 

- **Related Exceptions** 

###### **Task history is immutable.** 

## **20.19 Business Rules** 

- **Tasks are automatically generated whenever possible.** 

- **Every task belongs to one business object.** 

- **Tasks are initially assigned to roles rather than individuals.** 

- **Operators claim tasks by starting work.** 

- **Completing the workflow automatically completes the task.** 

- **Task priority is configurable and may be overridden by managers.** 

- **Task execution follows workflow dependencies.** 

- **Scan-based task discovery follows the same business rules as My Tasks.** 

- **Blocked tasks cannot be completed until blocking exceptions are resolved.** 

- **Every task is permanently audited.** 

## **20.20 End-to-End Example** 

**Sorting Completed** 

###### **↓** 

###### **System Creates** 

###### **Washing Task** 

###### **↓** 

###### **Assigned Role:** 

###### **Washing Operator** 

###### **↓** 

###### **Operator Starts Session** 

###### **↓** 

###### **My Tasks** 

###### **↓** 

###### **Claim Task** 

###### **↓** 

###### **Scan Basket** 

###### **↓** 

###### **Complete Washing** 

###### **↓** 

###### **Task Completed** 

**↓** 

###### **System Creates Slicing Task** 

## **20.21 Workflow Summary** 

**The Task Workflow is the operational orchestration layer of the system. It automatically converts business events into actionable work, assigns responsibilities to the appropriate roles, and guides operators through the correct sequence of operations using My Tasks or scan-driven execution.** 

**By separating task management from business logic, supporting configurable priorities, manager overrides, automatic task generation, and dependency enforcement, the workflow ensures efficient factory operations while keeping the application simple enough for Version 1 and scalable for future enhancements.** 

## **21 Audit Workflow** 

## **21.1 Purpose** 

**The Audit Workflow provides a complete, immutable history of every significant activity performed within the system.** 

**Unlike operational workflows, the Audit Workflow does not execute business processes. Instead, it continuously records who performed an action, what was changed, when it occurred, where it happened, and why it happened (when applicable).** 

**Its primary purpose is to ensure accountability, traceability, regulatory compliance, and support for operational investigations.** 

**The Audit Workflow is a cross-cutting system service that operates automatically across all modules.** 

## **21.2 Business Objectives** 

**The Audit Workflow enables the factory to:** 

- **Track every important business action.** 

- **Record user accountability.** 

- **Support internal and external audits.** 

- **Investigate operational incidents.** 

- **Reconstruct historical events.** 

- **Meet food safety and quality compliance requirements.** 

**Audit records are never used to drive business logic; they exist solely as historical evidence.** 

## **21.3 Audit Principles** 

**The system is built on the following audit principles:** 

**1. Every significant business event is recorded automatically.** 

**2. Audit records are immutable.** 

###### **3. Historical data is never overwritten. 4. Audit logging does not interrupt production workflows. 5. Every audit event references the related business object.** 

**These principles apply uniformly across the application.** 

## **21.4 Workflow Overview** 

**Business Event** 

**│** 

**▼** 

###### **Execute Validation** 

**│** 

**▼** 

###### **Commit Transaction** 

**│** 

**▼** 

###### **Generate Audit Event** 

**│** 

**▼** 

###### **Store Audit Record** 

**│** 

**▼** 

###### **Available for Search** 

**Audit creation occurs automatically after successful business transactions.** 

## **21.5 Audited Events** 

###### **Examples of audited events include:** 

###### **User Activities** 

- **Login** 

- **Logout** 

- **Session Start** 

- **Session End** 

- **Password Change** 

###### **Inventory** 

- **Receiving** 

- **Inventory Movement** 

- **Inventory Adjustment** 

- **Location Change** 

###### **Production** 

- **Sorting** 

- **Washing** 

- **Slicing** 

- **Freezing** 

- **Freeze Drying** 

- **Conventional Drying** 

- **Packaging** 

###### **Labels** 

- **Initial Print** 

- **Reprint** 

- **Failed Print** 

###### **Shipping** 

- **Shipment Creation** 

- **Picking** 

- **Loading** 

- **Shipment Confirmation** 

###### **Management** 

- **Manager Override** 

- **Exception Resolution** 

- **Configuration Change** 

- **User Permission Change** 

## **21.6 Audit Record Structure** 

###### **Every audit event stores:** 

- **Audit ID** 

- **Event Type** 

- **Event Category** 

- **Timestamp (UTC)** 

- **User** 

- **Role** 

- **Session ID** 

- **Device ID** 

- **Workstation** 

- **Business Object Type** 

- **Business Object ID** 

- **Result (Success / Failure)** 

- **Additional Metadata (optional)** 

###### **The exact metadata depends on the event type.** 

## **21.7 Before and After Values** 

**For update operations, the audit record captures the state before and after the change.** 

**Example:** 

**F Before i** 

**After** 



<!-- Start of picture text -->
e<br>l<br>d<br>S Ready for  Packag<br>t Packaging ed<br>a<br>t<br>u<br>s<br>L Packaging  Finishe<br>o Area d<br>c Goods<br>a<br>t<br>i<br>o<br>n<br><!-- End of picture text -->

###### **This allows complete reconstruction of operational history.** 

## **21.8 Read vs Write Operations** 

###### **Version 1 distinguishes between:** 

###### **Read Operations** 

###### **Examples:** 

- **Searching inventory** 

- **Viewing reports** 

- **Opening dashboards** 

**These are generally not audited individually, except for sensitive operations such as traceability searches.** 

###### **Write Operations** 

**Examples:** 

- **Creating inventory** 

- **Updating status** 

- **Printing labels** 

- **Completing shipments** 

###### **These are always audited.** 

## **21.9 Audit Categories** 

**The system classifies audit events into configurable categories.** 

###### **Examples:** 

- **Authentication** 

- **Inventory** 

- **Production** 

- **Packaging** 

- **Shipping** 

- **Labeling** 

- **Exceptions** 

- **Configuration** 

- **Administration** 

- **Security** 

###### **This simplifies reporting and filtering.** 

## **21.10 Audit Search** 

###### **Authorized users may search audit history by:** 

- **Date Range** 

- **User** 

- **Role** 

- **Business Object** 

- **Production Batch** 

- **Shipment** 

- **Session** 

- **Device** 

- **Event Type** 

- **Category** 

- **Result** 

**Audit searches are optimized for investigation rather than daily operations.** 

## **21.11 Object History** 

**From any business object, users may view its complete audit history.** 

**Example:** 

**Carton CT-1055** 

###### **↓** 

###### **Created** 

###### **↓** 

###### **Label Printed** 

###### **↓** 

###### **Moved to Warehouse** 

###### **↓** 

###### **Assigned to Shipment** 

**↓** 

###### **Loaded** 

###### **↓** 

###### **Shipped** 

###### **This provides a chronological operational timeline.** 

## **21.12 Security** 

**Only authorized roles may access audit data.** 

**Typical permissions:** 

|**Role**|**Access**|
|---|---|
|**Operator**|**Own activities only**<br>**(optional)**|
|**Supervisor**|**Department**<br>**activities**|
|**Manager**|**All operational**<br>**activities**|
|**System**<br>**Administrat**<br>**or**|**Full audit access**|



###### **Permissions are configurable.** 

## **21.13 Retention Policy** 

**Audit records are never deleted during normal system operation.** 

###### **Version 1 assumes:** 

- **Permanent logical retention.** 

- **Optional archival for very old records.** 

- **Archived data remains searchable if restored.** 

**Retention policies may be configured to satisfy local regulatory requirements.** 

## **21.14 Performance Considerations** 

**Audit logging is designed to have minimal impact on production.** 

###### **The system:** 

- **Generates audit events automatically.** 

- **Stores only relevant information.** 

- **Avoids duplicate records.** 

- **Separates audit storage from operational logic where practical.** 

**This ensures scalability as transaction volume grows.** 

## **21.15 Exception Handling** 

###### **Audit Storage Failure** 

**If an audit record cannot be written due to a temporary technical issue:** 

- **The business transaction is not silently ignored.** 

- **The system records a critical system exception.** 

- **Depending on configuration, the transaction may be retried or halted to preserve audit integrity.** 

###### **Invalid User** 

**Transactions cannot proceed without a valid authenticated user.** 

###### **Missing Session** 

###### **System-generated background processes may create audit records without an operator session, but they are identified as System Process.** 

## **21.16 Integration with Other Workflows** 

###### **The Audit Workflow automatically records events from:** 

- **Session Workflow** 

- **Task Workflow** 

- **Receiving Workflow** 

- **Inventory Movement Workflow** 

- **Packaging Workflow** 

- **Shipping Workflow** 

- **Label Printing Workflow** 

- **Reprint Workflow** 

- **Exception Workflow** 

- **Manager Override Workflow** 

- **Configuration Management** 

###### **No workflow requires manual audit entry.** 

## **21.17 Business Rules** 

- **Every significant write operation is audited.** 

- **Audit records are immutable.** 

- **Historical records cannot be edited or deleted.** 

- **Every audit event references its related business object.** 

- **Sensitive search activities may also be audited.** 

- **Audit permissions are role-based.** 

- **Audit logging operates automatically.** 

- **Audit history survives data corrections and manager overrides.** 

- **Every manager override must generate an audit event.** 

- **Every configuration change must generate an audit event.** 

## **21.18 End-to-End Example** 

###### **Operator Starts Packaging** 

###### **↓** 

###### **Package Created** 

###### **↓** 

###### **Package Label Printed** 

###### **↓** 

###### **Carton Completed** 

###### **↓** 

###### **Carton Label Printed** 

###### **↓** 

###### **Carton Moved to Warehouse** 

**↓** 

###### **Shipment Created** 

###### **↓** 

###### **Shipment Confirmed** 

###### **↓** 

###### **Audit Timeline Available** 

## **21.19 Relationship with Traceability** 

**Although closely related, Audit and Traceability serve different purposes.** 

**Audit Workflow** 

**Traceability Workflow** 

**Focuses on user actions Focuses on product genealogy and system events** 

**Records who performed an Records where the product came from action and where it went** 

**Includes configuration and security events** 

**Includes production and logistics relationships** 

**Supports accountability Supports recalls and product history and compliance** 

**Together, these two workflows provide complete operational transparency.** 

## **21.20 Workflow Summary** 

**The Audit Workflow provides the permanent historical memory of the entire application. It automatically records every significant business transaction, management action, and system event without requiring user intervention.** 

**By enforcing immutable records, capturing before-and-after values, supporting powerful search capabilities, and integrating transparently with every operational workflow, the Audit Workflow ensures accountability, regulatory compliance, and complete historical visibility across the factory. It complements the Traceability Workflow by documenting who performed each action, while Traceability explains how products moved through the production lifecycle.** 

## **22 Configuration Workflow** 

## **22.1 Purpose** 

**The Configuration Workflow provides a centralized mechanism for managing all business rules, master data, and operational parameters without requiring software changes.** 

**One of the core design principles of this system is that the application should be driven by configuration, not hard-coded logic. New product grades, package sizes, warehouses, machines, workflows, or business parameters should be added through configuration whenever possible.** 

**The Configuration Workflow ensures that the factory can adapt to operational changes while keeping the software stable and maintainable.** 

## **22.2 Business Objectives** 

**The Configuration Workflow enables the factory to:** 

- **Configure the system without software development.** 

- **Reduce dependence on programmers.** 

- **Standardize business settings.** 

- **Support future expansion.** 

- **● Control operational behavior through configurable rules.** 

- **● Maintain a complete history of configuration changes.** 

## **22.3 Configuration Principles** 

**The system follows these principles:** 

**1. Configuration drives business behavior.** 

**2. Configuration changes never modify historical transactions.** 

**3. Configuration is version-independent whenever possible.** 

**4. Every configuration change is audited.** 

**5. Configuration is protected by role-based permissions.** 

## **22.4 Workflow Overview** 

###### **Manager Opens Configuration** 

**│** 

**▼** 

**Select Configuration Category** 

**│** 

**▼** 

###### **Create / Edit / Disable** 

**│** 

**▼** 

###### **Validate Configuration** 

**│** 

**▼** 

**Save Changes** 

**│** 

**▼** 

**Audit Recorded** 

**│** 

**▼** 

**Available for Future Operations** 

**Configuration affects only future transactions unless explicitly stated otherwise.** 

## **22.5 Configuration Categories** 

**The system supports multiple configuration groups.** 

###### **Products** 

- **Product Types** 

- **Product Categories** 

- **Product Statuses** 

###### **Quality** 

- **Grades** 

- **Size Classes** 

- **Quality Codes** 

###### **Packaging** 

- **Package Sizes** 

- **Package Types** 

- **Weight Tolerances** 

- **Label Templates** 

###### **Warehouses** 

- **Warehouses** 

- **Storage Zones** 

- **Cold Rooms** 

- **Locations** 

###### **Production** 

- **Machines** 

- **Freeze Dryers** 

- **Conventional Dryers** 

- **Freezers** 

- **Washing Stations** 

- **Slicing Stations** 

###### **Workflow** 

- **Task Priorities** 

- **Status Definitions** 

- **Session Types** 

- **Exception Categories** 

- **● Workflow Timeouts** 

###### **Users** 

- **Roles** 

- **Permissions** 

- **Departments** 

###### **Shipping** 

- **Shipping Methods** 

- **Destination Types** 

- **Shipment Statuses** 

###### **Label Printing** 

- **Printers** 

- **Printer Assignments** 

- **Label Templates** 

- **Barcode Formats** 

###### **System** 

- **Numbering Rules** 

- **Default Timeouts** 

- **Localization** 

- **Units of Measure** 

## **22.6 Example Configuration** 

**Example:** 

**Adding a new truffle grade.** 

**Current Grades:** 

- **Grade A** 

- **● Grade B ● Industrial** 

**Manager adds:** 

**Grade A+** 

**No software modification is required.** 

**The new grade becomes available immediately for future receiving and sorting operations.** 

## **22.7 Activation and Deactivation** 

**Configuration records should rarely be deleted.** 

**Instead, they may be:** 

- **Active** 

- **● Inactive** 

**Example:** 

**A discontinued package size:** 

**100 g** 

**↓** 

**Inactive** 

**Historical records continue referencing the original configuration.** 

## **22.8 Configuration Validation** 

**Before saving:** 

###### **The system validates:** 

- **Required fields** 

- **Duplicate values** 

- **Referential integrity** 

- **Naming conventions** 

###### **Invalid configurations cannot be saved.** 

## **22.9 Effective Date** 

**Some configuration items may support an effective date.** 

**Example:** 

**New package weight tolerance becomes effective:** 

**01 January 2027** 

**Transactions before that date continue using the previous configuration.** 

**Version 1 may implement this feature only where business value justifies the additional complexity.** 

## **22.10 Configuration Versioning** 

**The system does not overwrite historical configuration values.** 

**When appropriate:** 

**Old Configuration** 

###### **↓** 

**Inactive** 

###### **↓** 

**New Configuration** 

**Historical transactions continue referencing the configuration that was active when they were created.** 

## **22.11 Permissions** 

**Only authorized users may modify configuration.** 

**Typical permissions:** 

**Role Configuration Access Operator View only (optional) Supervisor Limited configuration Factory Operational Manager configuration System Full Administrat configuration or** 

###### **Permissions are configurable.** 

**22.12 Configuration Dependencies Some configuration items depend on others.** 

**Example:** 

**Package Size** 

###### **↓** 

###### **Requires** 

###### **↓** 

###### **Package Type** 

###### **↓** 

###### **Requires** 

###### **↓** 

###### **Label Template** 

###### **The system validates these relationships before saving.** 

## **22.13 Import and Export** 

**Version 1 supports optional import/export for configuration data.** 

**Typical formats:** 

- **Excel (.xlsx)** 

- **CSV** 

###### **This simplifies:** 

- **Initial deployment.** 

- **Backup.** 

- **Migration.** 

- **Bulk updates.** 

###### **Operational data cannot be imported through this module.** 

## **22.14 Configuration Search** 

**Managers may search configuration by:** 

- **Category** 

- **Name** 

- **Status** 

- **Creation Date** 

- **Last Modified** 

- **Created By** 

###### **Inactive records remain searchable.** 

## **22.15 Exception Handling** 

**Duplicate Configuration** 

###### **Rejected.** 

###### **Invalid Reference** 

###### **Rejected.** 

###### **In Use** 

###### **If a configuration item is already referenced by historical transactions:** 

###### **Deletion is prohibited.** 

###### **The item must be marked Inactive instead.** 

###### **Unauthorized User** 

###### **Modification denied.** 

## **22.16 Audit Trail** 

###### **Every configuration change records:** 

- **Configuration ID** 

- **Category** 

- **Previous Value** 

- **New Value** 

- **User** 

- **Date** 

- **Time** 

- **Reason (optional)** 

- **Change Type** 

###### **Configuration history is immutable.** 

## **22.17 Business Rules** 

- **Configuration controls future system behavior.** 

- **Historical transactions are never modified by configuration changes.** 

- **Configuration items should be deactivated rather than deleted.** 

- **Every configuration change is audited.** 

- **Permissions are role-based.** 

- **Configuration validation occurs before saving.** 

- **Duplicate configuration values are prohibited where uniqueness is required.** 

- **Configuration dependencies must remain valid.** 

- **Numbering rules are configurable.** 

- **Label templates and workflow parameters are configurable.** 

## **22.18 End-to-End Example** 

**Factory Manager** 

###### **↓** 

###### **Configuration** 

###### **↓** 

###### **Packaging** 

###### **↓** 

###### **Create New Package Size** 

**75 g** 

###### **↓** 

###### **Weight Tolerance** 

###### **±0.5 g** 

###### **↓** 

###### **Assign Label Template** 

###### **↓** 

###### **Save** 

###### **↓** 

###### **Validation Passed** 

###### **↓** 

###### **Audit Recorded** 

**↓** 

###### **Available for Future Packaging Sessions** 

## **22.19 Relationship with Other Workflows** 

**The Configuration Workflow influences nearly every module but does not directly execute business operations.** 

###### **Examples:** 

- **Receiving Workflow uses configured product types and grades.** 

- **Packaging Workflow uses configured package sizes, tolerances, and label templates.** 

- **Shipping Workflow uses configured shipping methods.** 

- **Task Workflow uses configured priorities.** 

- **Session Workflow uses configured session types.** 

- **Exception Workflow uses configured severity levels.** 

- **Label Printing Workflow uses configured printers and templates.** 

**This separation allows operational flexibility while preserving system stability.** 

## **22.20 Workflow Summary** 

**The Configuration Workflow is the administrative foundation of the system. It enables authorized users to adapt business rules, master data, and operational parameters without changing application code.** 

**By emphasizing configuration over customization, supporting activation/deactivation instead of deletion, preserving historical references, validating dependencies, and auditing every modification, the workflow ensures that the system remains flexible, maintainable, and scalable as business requirements evolve. It provides the factory with the ability to grow and change while protecting the integrity of historical operational data.** 

## **23 End-to-End Operational Example** 

#### **23.1 Purpose** 

**This section demonstrates how the complete system operates in a realistic factory scenario.** 

**The example follows a quantity of fresh truffle from supplier delivery through receiving, cold storage, sorting, processing, freeze drying, packaging, finished-goods storage, order preparation, shipping, and final traceability.** 

**The purpose is to demonstrate how the individual workflows described in Sections 2.1 through 2.22 operate together as one integrated system.** 

**The example also demonstrates:** 

- **Fixed Raspberry Pi terminals.** 

- **Mobile Android industrial scanners.** 

- **Role-based sessions.** 

- **My Tasks.** 

- **Scan-driven operations.** 

- **Manager prioritization.** 

- **Inventory movement.** 

- **Batch genealogy.** 

- **Production transformation.** 

- **Package and carton serialization.** 

- **Label printing and reprinting.** 

- **Shipping.** 

- **Audit.** 

- **Traceability.** 

- **Exception handling.** 

- **Manager overrides.** 

## **23.2 Scenario Background** 

**A supplier delivers fresh truffle to the factory.** 

**The delivery contains several baskets of fresh truffle.** 

**For this example:** 

**Supplier:** 

###### **Farmer A** 

###### **Delivery:** 

**DR-2026-071** 

**Product: Fresh Truffle** 

###### **Quantity:** 

**120 kg** 

###### **Initial Quality: Unsorted** 

###### **Baskets:** 

**B-001 B-002 B-003 B-004 B-005 B-006 B-007** 

**B-008 B-009** 

**B-010 B-011** 

**B-012** 

###### **Each basket contains one product only.** 

**The system does not require the basket to represent one final grade because grading occurs later during sorting.** 

## **23.3 Step 1 — Operator Login** 

**The receiving operator arrives at the fixed workstation.** 

**The workstation consists of:** 

- **Raspberry Pi** 

- **Barcode Scanner** 

- **Digital Scale** 

- **Label Printer** 

**The operator logs into the system.** 

###### **Login** 

**↓** 

###### **Select Role** 

**↓** 

###### **Receiving** 

**↓** 

###### **Start Session** 

**The system creates:** 

**Session RS-1001** 

###### **The session is associated with:** 

- **Operator** 

- **Raspberry Pi Terminal** 

- **Receiving Role** 

###### **● Start Time** 

## **23.4 Step 2 — Supplier Delivery** 

**The operator selects:** 

**Receive Delivery** 

**The system creates:** 

**Delivery DR-2026-071** 

**The operator selects:** 

**Farmer A** 

**The system loads the supplier information.** 

## **23.5 Step 3 — Weighing and Basket Creation** 

**The operator places the first basket on the scale.** 

**The system records:** 

**Basket: B-001** 

**Product: Fresh Truffle** 

**Weight:** 

**10.2 kg** 

###### **A unique Basket ID is generated.** 

**The basket label is printed.** 

**The same process is repeated for the remaining baskets.** 

###### **Each basket receives:** 

- **Basket ID** 

- **QR Code** 

- **Product** 

- **Weight** 

- **Receiving Batch** 

## **23.6 Step 4 — Receiving Batch Creation** 

**After receiving is completed, the system creates:** 

**Receiving Batch RB-2026-071** 

**The batch contains all 12 baskets.** 

**Example:** 

###### **RB-2026-071** 

###### **│** 

**├── B-001** 

**├── B-002** 

- **├── B-003** 

**├── B-004** 

- **├── B-005** 

- **├── B-006** 

- **├── B-007** 

- **├── B-008** 

- **├── B-009** 

**├── B-010 ├── B-011 └── B-012** 

###### **Supplier settlement remains linked to the delivery and received weights.** 

## **23.7 Step 5 — Cold Storage Task** 

**After receiving is completed, the system automatically generates:** 

**Move to Cold Storage** 

**The task is assigned to:** 

**Warehouse / Cold Storage Operator** 

**The operator receives the task in:** 

###### **My Tasks** 

## **23.8 Step 6 — Mobile Operator** 

**The warehouse operator uses an Android industrial scanner.** 

**The operator logs in:** 

**Login** 

**↓** 

###### **Select Role** 

**↓** 

###### **Cold Storage** 

**↓** 

###### **Start Session** 

**The system creates:** 

**Session CS-2001** 

**The operator opens:** 

**My Tasks** 

**and sees:** 

**Move B-001** 

**Move B-002** 

**Move B-003** 

**...** 

**Move B-012** 

## **23.9 Step 7 — Scan-Based Movement** 

**Instead of opening each task manually, the operator can simply scan the basket.** 

**The system identifies:** 

**B-001** 

**Status:** 

**Received** 

**Current Location:** 

**Receiving** 

**Next Available Operation:** 

###### **Cold Storage** 

###### **The operator scans the destination location.** 

**The system records:** 

**Receiving** 

**↓** 

**Cold Storage** 

###### **The inventory location is updated immediately.** 

## **23.10 Step 8 — Manager Prioritization** 

**The factory manager opens the Manager Dashboard.** 

**The manager sees 12 baskets waiting in cold storage.** 

**The manager decides that some baskets should be processed immediately because they are older.** 

**The manager prioritizes:** 

**B-001** 

**B-002** 

**B-003** 

**B-004** 

**for washing.** 

**The system changes their task priority.** 

**Example:** 

**B-001    Critical** 

**B-002    High** 

**B-003    High** 

**B-004    High** 

**B-005    Normal** 

**B-006    Normal** 

**...** 

**The manager's action is recorded in the Audit Log.** 

## **23.11 Step 9 — Washing Session** 

**The washing operator uses an Android industrial scanner.** 

**The operator logs in:** 

**Login** 

**↓** 

**Select Role** 

**↓** 

**Washing** 

**↓** 

**Start Session** 

**The system creates:** 

**Session WS-3001** 

**The operator opens:** 

**My Tasks** 

**The prioritized baskets appear first.** 

## **23.12 Step 10 — Scan Basket** 

**The operator scans:** 

**B-001** 

**The system displays:** 

**Product:** 

**Fresh Truffle** 

**Status:** 

**Ready for Washing** 

**Priority:** 

**Critical** 

**Action:** 

**Start Washing** 

**The operator confirms.** 

**The washing workflow begins.** 

## **23.13 Step 11 — Washing Completion** 

**After washing:** 

**Basket: B-001** 

**Before:** 

###### **10.2 kg** 

**After:** 

###### **11.8 kg** 

**The system records the new weight.** 

**Importantly, the original receiving weight is not overwritten. The system retains:** 

**Received Weight: 10.2 kg** 

**Washed Weight:** 

**11.8 kg** 

**This allows the factory to analyze yield and weight changes.** 

## **23.14 Step 12 — Sorting** 

**The system automatically creates a sorting task.** 

**The sorting operator scans B-001.** 

**The system opens:** 

**Sorting Workflow** 

**The operator sorts the contents into quality categories. For example:** 

###### **Grade A:** 

###### **7.0 kg** 

**Grade B:** 

###### **3.2 kg** 

**Industrial:** 

###### **1.6 kg** 

###### **The original basket is consumed by the sorting process.** 

**The system creates new production records representing the resulting classified material.** 

**Genealogy remains:** 

###### **B-001** 

**↓** 

###### **Sorting Operation** 

**├── Grade A** 

**├── Grade B** 

**└── Industrial** 

## **23.15 Step 13 — Processing Decision** 

**The manager decides:** 

**Grade A** 

**→ Fresh Export** 

###### **Grade B** 

###### **→ Processing** 

###### **Industrial** 

###### **→ Processing** 

###### **The system therefore generates different downstream tasks.** 

**For example:** 

###### **Grade A** 

**→ Fresh Export Packing** 

###### **Grade B** 

###### **→ Washing / Slicing** 

###### **Industrial** 

###### **→ Conventional Processing** 

**This demonstrates that the system does not require every product to follow the same production path.** 

## **23.16 Step 14 — Slicing** 

**A Grade B production batch is selected for freeze drying.** 

**The slicing operator starts:** 

**Session:** 

###### **SL-4001** 

**Role:** 

**Slicing** 

###### **The operator scans the production batch.** 

**The system confirms:** 

**Status:** 

**Ready for Slicing** 

**The operator performs slicing.** 

**The system records:** 

- **Input Batch** 

- **Operator** 

- **Session** 

- **Start Time** 

- **End Time** 

- **Output Quantity** 

## **23.17 Step 15 — Freezing** 

**After slicing, the system generates:** 

**Freezing Task** 

**The operator scans the processed product.** 

**The freezing workflow begins.** 

**The system records:** 

**Input:** 

**Sliced Truffle Batch** 

###### **↓** 

###### **Freezing Operation** 

###### **↓** 

###### **Frozen Product Batch** 

## **23.18 Step 16 — Freeze Drying** 

**The freeze-drying operator starts a session.** 

**Role:** 

**Freeze Drying** 

**The operator scans the frozen batch.** 

**The system creates a Freeze Drying Cycle.** 

###### **Example:** 

**Cycle:** 

**FD-2026-0045** 

**Machine:** 

**Freeze Dryer 01** 

**Input:** 

###### **PB-2026-031** 

**Operator:** 

###### **Operator X** 

###### **The operator loads the product into the freeze dryer.** 

**The system records the trays used.** 

## **23.19 Step 17 — Freeze Drying Completion** 

**After the cycle finishes:** 

**Input:** 

**12.5 kg** 

**Output:** 

**1.6 kg** 

**The system creates:** 

**Freeze-Dried Production Batch PB-2026-055** 

**The genealogy is preserved:** 

**Supplier** 

**↓** 

**Receiving Batch** 

**↓** 

**Basket** 

**↓** 

###### **Sorting** 

**↓** 

###### **Processing Batch** 

**↓** 

###### **Slicing** 

**↓** 

###### **Freezing** 

**↓** 

###### **Freeze Drying Cycle** 

**↓** 

###### **Freeze-Dried Batch** 

## **23.20 Step 18 — Packaging Task** 

**Completion of freeze drying automatically generates:** 

**Packaging Task** 

**The task appears for:** 

###### **Packaging Operator** 

## **23.21 Step 19 — Packaging Session** 

**The packaging operator uses the fixed Raspberry Pi terminal.** 

**The terminal includes:** 

**● Raspberry Pi** 

- **Barcode Scanner** 

- **Scale** 

- **Label Printer** 

**The operator starts:** 

**Role:** 

**Packaging** 

**The system creates:** 

**Session PK-5001** 

## **23.22 Step 20 — Package Creation** 

**The operator scans:** 

**PB-2026-055** 

**The system displays:** 

**Product:** 

**Freeze-Dried Truffle** 

**Available:** 

**1.6 kg** 

**Package Format:** 

**20 g** 

**The operator fills the first package.** 

**The package is placed on the scale.** 

**The system records:** 

**Target:** 

**20 g** 

**Actual:** 

**20.1 g** 

**Result:** 

**Accepted** 

**The system creates:** 

**Package PK-000001** 

**A label is automatically printed.** 

**The same process continues.** 

## **23.23 Step 21 — Carton Assembly** 

**After producing 20 packages, the operator begins a carton.** 

**The important rule is:** 

**The operator does not scan the empty carton first.** 

**Instead:** 

**Scan PK-000001** 

**Scan PK-000002** 

**Scan PK-000003** 

**...** 

**Scan PK-000020** 

###### **The system builds the carton digitally.** 

**After the final package:** 

**Create Carton** 

**The system creates:** 

**Carton CT-000145** 

**The carton contains exactly the 20 scanned packages.** 

## **23.24 Step 22 — Carton Label Printing** 

**The system generates the carton label.** 

**The label contains:** 

**Carton: CT-000145** 

**Packages: 20** 

**Product: Freeze-Dried Truffle** 

**QR:** 

**[Unique QR]** 

**The label is sent to the printer.** 

## **23.25 Step 23 — Printer Failure** 

**Suppose the printer has run out of labels.** 

**The carton is created successfully, but printing fails.** 

**The system records:** 

**Carton: CT-000145** 

**Status:** 

**Pending Label** 

**Reason:** 

**Printer Out of Labels** 

**The carton appears in:** 

**Pending Label Queue** 

**The physical carton remains at the packaging workstation.** 

**It is not moved to the warehouse.** 

## **23.26 Step 24 — Reprint** 

**The operator replaces the label roll.** 

**The operator opens:** 

**Pending Label Queue** 

**The system displays:** 

**CT-000145** 

###### **Pending Label** 

###### **Printer Error** 

**The operator selects:** 

**Reprint** 

**The exact same label is printed.** 

**The serial number does not change.** 

**The QR code does not change.** 

**The carton becomes:** 

**Ready** 

**The operator attaches the label.** 

## **23.27 Step 25 — Finished Goods Movement** 

**The system automatically creates:** 

**Move Carton to Finished Goods** 

**A warehouse operator receives the task on the Android scanner.** 

**The operator scans:** 

**CT-000145** 

**The system verifies:** 

**Carton:** 

**Valid** 

**Status:** 

###### **Ready** 

**Label:** 

**Printed** 

**Destination:** 

**Finished Goods** 

**The operator moves the carton.** 

**Inventory is updated.** 

## **23.28 Step 26 — Customer Order** 

**A customer order is entered:** 

**Sales Order:** 

**SO-2026-088** 

**Customer:** 

**European Customer A** 

**Required:** 

**5 Cartons** 

**The system creates:** 

**Shipment SH-2026-041** 

**and generates picking tasks.** 

## **23.29 Step 27 — Picking** 

**The warehouse operator opens:** 

**My Tasks** 

**The system displays:** 

**Pick CT-000145 Pick CT-000146 Pick CT-000147 Pick CT-000148 Pick CT-000149** 

**The operator scans each carton.** 

**The system verifies that each carton belongs to the shipment.** 

## **23.30 Step 28 — Wrong Carton Attempt** 

**The operator accidentally scans: CT-000200** 

**The system detects:** 

**Carton does not belong** 

**to Shipment SH-2026-041** 

**The operation is blocked.** 

**No inventory change occurs.** 

**The event is recorded as an exception/audit event.** 

###### **The operator continues with the correct carton.** 

## **23.31 Step 29 — Shipment Confirmation** 

**All five required cartons are scanned.** 

**The system displays:** 

**Expected:** 

**5** 

**Scanned:** 

**5** 

**Status:** 

**Complete** 

**The operator loads the shipment.** 

**The manager confirms shipment. Shipment status becomes:** 

**Shipped** 

**Inventory is reduced automatically.** 

## **23.32 Step 30 — Traceability** 

**Several weeks later, the customer reports an issue with:** 

###### **Carton CT-000145** 

###### **The manager scans the carton QR.** 

###### **The system displays:** 

###### **Carton CT-000145** 

**↓** 

###### **20 Packages** 

- **↓** 

###### **Production Batch PB-2026-055** 

- **↓** 

###### **Freeze Drying Cycle FD-2026-0045** 

**↓** 

###### **Freezing Batch** 

- **↓** 

###### **Slicing Batch** 

- **↓** 

###### **Sorting Batch** 

**↓** 

###### **Basket B-001** 

- **↓** 

###### **Receiving Batch RB-2026-071** 

**↓** 

###### **Farmer A** 

###### **The manager can also trace forward:** 

###### **PB-2026-055** 

**↓** 

###### **Packages** 

**↓** 

###### **Cartons** 

**↓** 

###### **Shipments** 

**↓** 

###### **Customers** 

## **23.33 Step 31 — Audit History** 

**The manager opens the audit history for CT-000145.** 

**The system shows:** 

**Carton Created** 

**↓** 

###### **Packages Scanned** 

**↓** 

###### **Label Print Failed** 

**↓** 

###### **Reprint Requested** 

**↓** 

###### **Label Reprinted** 

**↓** 

###### **Moved to Finished Goods** 

**↓** 

###### **Picked for Shipment** 

**↓** 

###### **Loaded** 

**↓** 

###### **Shipped** 

###### **Every event contains:** 

- **User** 

- **Device** 

- **Session** 

- **Timestamp** 

- **Action** 

## **23.34 Complete Genealogy** 

**The final genealogy is:** 

###### **SUPPLIER** 

**│** 

**▼** 

###### **DELIVERY** 

**│** 

**▼** 

###### **RECEIVING BATCH** 

**│** 

**▼** 

###### **BASKET** 

**│** 

**▼** 

###### **SORTING** 

**│** 

**├──────────────► Fresh Export** 

**│** 

**▼** 

###### **PROCESSING BATCH** 

**│** 

**▼** 

###### **SLICING** 

**│** 

**▼** 

###### **FREEZING** 

**│** 

**▼** 

###### **FREEZE DRYING CYCLE** 

**│** 

**▼** 

###### **FREEZE-DRIED BATCH** 

**│** 

**▼** 

###### **PACKAGING** 

**│** 

**├── Package ├── Package ├── Package** 

**└── ...** 

**│** 

**▼ │ ▼** 

###### **CARTON** 

###### **SHIPMENT** 

**│** 

**▼** 

###### **CUSTOMER** 

## **23.35 Role Interaction** 

###### **The same operational example involves multiple roles:** 

|**Role**|**Main Responsibility**|
|---|---|
|**Receiving**<br>**Operator**|**Receive and weigh**<br>**product**|
|**Warehouse**<br>**Operator**|**Move inventory**|
|**Sorting**<br>**Operator**|**Classify product**|
|**Washing**<br>**Operator**|**Wash product**|
|**Slicing**<br>**Operator**|**Slice product**|
|**Freezing**|**Freeze product**|



###### **Operator** 

**Freeze Drying Run freeze-drying Operator cycle Packaging Create retail Operator packages Shipping Pick and load Operator shipments Manager Prioritize, approve and override System Configure system Administrator** 

**The same physical terminals can assume different roles.** 

## **23.36 Device Interaction** 

**The system uses two main terminal types.** 

###### **Fixed Terminal** 

###### **Raspberry Pi** 

**│** 

**├── Barcode Scanner** 

**├── Scale** 

**└── Label Printer** 

###### **Primarily used for:** 

- **Receiving** 

- **Weighing** 

- **Packaging** 

- **Label Printing** 

###### **Mobile Terminal** 

###### **Industrial Android PDA** 

###### **Primarily used for:** 

- **Warehouse Movement** 

- **Washing** 

- **Sorting** 

- **Picking** 

- **Shipping** 

- **Mobile Production Operations** 

###### **Both terminal types access the same business logic.** 

## **23.37 My Tasks vs Scan** 

###### **Operators have two ways to work.** 

###### **Method 1 — My Tasks** 

###### **Login** 

**↓** 

###### **Select Role** 

**↓** 

###### **My Tasks** 

**↓** 

###### **Select Task** 

**↓** 

###### **Execute** 

###### **Method 2 — Scan** 

###### **Login** 

**↓** 

###### **Select Role** 

**↓** 

###### **Scan Object** 

**↓** 

###### **System Identifies Operation** 

**↓** 

**Execute** 

**Both methods ultimately use the same workflow engine and business rules.** 

## **23.38 Manager Intervention** 

**The manager does not need to manually control routine operations.** 

**The system operates automatically.** 

**The manager intervenes only when necessary.** 

**Examples:** 

###### **Prioritize Basket** 

**↓** 

###### **Override Workflow** 

**↓** 

**Resolve Exception** 

**↓** 

###### **Approve Shipment** 

**↓** 

###### **Review Dashboard** 

**This keeps the system operationally efficient without turning the manager into a data-entry operator.** 

## **23.39 Data Integrity** 

**Throughout the entire example:** 

- **Original receiving weights are preserved.** 

- **Production transformations are preserved.** 

- **Parent-child relationships are preserved.** 

- **Package serial numbers never change.** 

- **Carton serial numbers never change.** 

- **Reprints never create new identities.** 

- **Inventory movements are recorded.** 

- **Manager overrides are audited.** 

- **Historical transactions are never deleted.** 

**This ensures that the final customer product can always be traced back to its origin.** 

## **23.40 Exception Example** 

**Suppose the freeze dryer stops unexpectedly.** 

**The system records:** 

**Exception:** 

**Freeze Dryer Interrupted** 

**Machine:** 

**Freeze Dryer 01** 

###### **Cycle:** 

###### **FD-2026-0045** 

**Severity:** 

**High** 

**The manager investigates.** 

**The manager decides to move the product to another machine.** 

**The manager performs an override.** 

**The system records:** 

**Before: Freeze Dryer 01** 

**After:** 

**Freeze Dryer 02** 

**Reason:** 

**Equipment Failure** 

**The original cycle history remains intact.** 

**The new processing event references the original batch.** 

**Genealogy is therefore preserved.** 

## **23.41 What the System Knows at Any Moment** 

**At any point, management can answer:** 

**What do we have?** 

**Current inventory.** 

###### **Where is it?** 

**Current location.** 

###### **What is it?** 

**Product, grade, size, batch, or package.** 

**Where did it come from?** 

**Supplier and receiving history.** 

**What happened to it?** 

**Production history.** 

###### **Who handled it?** 

**Operator and session history.** 

**Which machine processed it?** 

**Machine and cycle history.** 

**Where did it go?** 

**Movement and shipment history.** 

**Who received it?** 

**Customer and shipment history.** 

**This is the central purpose of the system.** 

## **23.42 End-to-End System View** 



<!-- Start of picture text -->
┌──────────────────┐<br>                         SUPPLIER     │ │<br>└────────┬─────────┘<br>│<br>▼<br>┌──────────────────┐<br>                        RECEIVING     │ │<br>└────────┬─────────┘<br>│<br>▼<br>┌──────────────────┐<br>                      COLD STORAGE    │ │<br>└────────┬─────────┘<br>│<br>▼<br>┌──────────────────┐<br>                         SORTING      │ │<br>└───────┬──────────┘<br>│<br>┌──────────┴──────────┐<br>▼ ▼<br>┌────────────────┐┌────────────────┐<br>          FRESH EXPORT        PROCESSING   │ ││ │<br>└────────────────┘└───────┬────────┘<br><!-- End of picture text -->



<!-- Start of picture text -->
│<br>▼<br>┌──────────────┐<br>                                  WASHING   │ │<br>└──────┬───────┘<br>│<br>▼<br>┌──────────────┐<br>                                 SLICING    │ │<br>└──────┬───────┘<br>│<br>▼<br>┌──────────────┐<br>                                 FREEZING   │ │<br>└──────┬───────┘<br>│<br>▼<br>┌──────────────┐<br>                               FREEZE DRYING│ │<br>└──────┬───────┘<br>│<br>▼<br>┌──────────────┐<br>                                PACKAGING   │ │<br>└──────┬───────┘<br>│<br><!-- End of picture text -->



<!-- Start of picture text -->
▼<br>┌──────────────┐<br>                              FINISHED GOODS│ │<br>└──────┬───────┘<br>│<br>▼<br>┌──────────────┐<br>                                 SHIPPING   │ │<br>└──────┬───────┘<br>│<br>▼<br>┌──────────────┐<br>                                 CUSTOMER   │ │<br>└──────────────┘<br><!-- End of picture text -->

## **23.43 Cross-Cutting System Services** 

###### **Throughout the entire lifecycle, the following services operate continuously:** 



<!-- Start of picture text -->
┌─────────────────────┐<br>                    SESSION ENGINE    │ │<br>└──────────┬──────────┘<br><!-- End of picture text -->



<!-- Start of picture text -->
│<br>                      TASK ENGINE     │ │<br><!-- End of picture text -->

**┌──────────▼──────────┐** 



<!-- Start of picture text -->
└──────────┬──────────┘<br>│<br>┌─────────────────┼─────────────────┐<br>▼ ▼ ▼<br>┌────────────┐ ┌────────────┐ ┌────────────┐<br>    TRACEABILITY        AUDIT       EXCEPTIONS  │ │ │ │ │ │<br>└────────────┘ └────────────┘ └────────────┘<br>│ │ │<br>└─────────────────┼─────────────────┘<br>▼<br>┌────────────────┐<br>                    CONFIGURATION  │ │<br>└────────────────┘<br><!-- End of picture text -->

###### **These services support all operational workflows rather than belonging to one specific production stage.** 

## **23.44 Final Operational Principle** 

**The system should behave according to the following fundamental rule:** 

**The operator performs the physical work. The system determines what the work is, validates it, records it, and creates the next required work.** 

**For example:** 

**Operator:** 

**Scans Basket** 

**System:** 

###### **Identifies Basket** 

###### **System:** 

###### **Determines Status** 

###### **System:** 

###### **Determines Correct Operation** 

###### **Operator:** 

###### **Performs Operation** 

###### **System:** 

###### **Records Result** 

###### **System:** 

###### **Updates Inventory** 

###### **System:** 

###### **Creates Next Task** 

###### **This cycle continues throughout the entire factory.** 

## **23.45 Final Example Summary** 

**The complete operational lifecycle can therefore be reduced to:** 

**RECEIVE** 

**↓** 

###### **IDENTIFY** 

**↓** 

###### **STORE** 

**↓** 

###### **PRIORITIZE** 

**↓** 

###### **PROCESS** 

**↓** 

###### **TRANSFORM** 

**↓** 

###### **PACKAGE** 

**↓** 

###### **LABEL** 

**↓** 

###### **STORE** 

**↓** 

###### **PICK** 

**↓** 

###### **SHIP** 

**↓** 

###### **TRACE** 

###### **At every stage:** 

**USER** 

**↓** 

###### **SESSION** 

**↓** 

###### **TASK** 

**↓** 

###### **SCAN** 

**↓** 

###### **WORKFLOW** 

**↓** 

###### **TRANSACTION** 

**↓** 

###### **INVENTORY UPDATE** 

**↓** 

###### **AUDIT** 

**↓** 

###### **NEXT TASK** 

**This is the core operating model of the system.** 

**The objective is not simply to digitize existing paperwork. The system is designed to create a controlled operational loop in which physical factory activity and digital inventory state remain synchronized throughout the entire product lifecycle.** 

# C. ER Diagram & Data Dictionary 

## **03. FINAL ER DIAGRAM & DATABASE SCHEMA** 

#### **Final Alignment with Business Rules, State Machines & Operational Scenarios** 

###### **Version 1.0 — Canonical Database Model** 

## **3.1 Purpose** 

This document defines the final canonical database model for the operational inventory, processing, packaging, traceability, shipping, session, task, audit, exception, override, and configuration system. 

The database must support: 

- Receiving 

- Basket management 

- Inventory 

- Batch genealogy 

- Sorting 

- Washing 

- Slicing 

- Freezing 

- Freeze drying 

- Conventional drying 

- Packaging 

- Cartonization 

- Label printing 

- Reprinting 

- Shipping 

- Traceability 

- Sessions 

- Tasks 

- Exceptions 

- Manager overrides 

- Audit 

- Configuration 

- Historical data integrity 

The model is designed around one fundamental principle: 

Physical operations create immutable business events and state transitions. Current state is derived from controlled records and must never destroy historical traceability. 

## **3.2 Canonical Entity Groups** 

The database is divided into eight logical groups. 

MASTER DATA 

├── products 

├── product_grades 

├── product_sizes 

├── units 

├── locations 

├── suppliers 

├── customers 

├── devices 

└── users 

###### OPERATIONAL IDENTIFICATION 

├── baskets 

├── batches 

├── packages 

└── cartons 

###### PROCESSING 

├── operations 

├── operation_inputs 

├── operation_outputs 

└── processing_cycles 

###### INVENTORY 

├── inventory_balances 

└── inventory_movements 

###### SHIPPING 

├── shipments 

- └── shipment_cartons 

###### LABELS 

├── labels 

└── label_print_attempts 

###### CONTROL & GOVERNANCE 

├── sessions 

├── tasks 

├── exceptions 

├── manager_overrides 

└── audit_logs 

###### CONFIGURATION 

├── configuration_groups 

├── configuration_versions 

- └── configuration_values 

## **3.3 Core ER Diagram** 

The following is the canonical high-level relationship model. 

┌──────────────┐ │   suppliers  │ └──────┬───────┘ │ │ 1:N ▼ ┌──────────────┐ │   batches    │ └──────┬───────┘ │ ┌────────────┼────────────┐ │            │            │ │            │            │ ▼            ▼            ▼ operations   inventory      baskets 

│ │ ┌─────┴─────┐ │           │ ▼           ▼ 

operation_inputs  operation_outputs 

│           │ └─────┬─────┘ 

│ 

▼ 

batches 

│ ┌────────┼─────────┐ │        │         │ ▼        ▼         ▼ 

packages   baskets   processing 

│                  cycles 

▼ cartons 

│ ▼ 

shipments 

│ 

▼ 

customers 

###### PRODUCT MASTER 

│ 

├──────────────► batches ├──────────────► packages └──────────────► configuration 

USERS 

│ ├──► sessions ├──► tasks ├──► exceptions ├──► manager_overrides └──► audit_logs 

CARTONS │ ├──► labels │       │ │       └──► label_print_attempts │ └──► shipment_cartons 

## **3.4 Critical Design Decision — Batch Genealogy** 

The most important database relationship is: 

Batch 

↓ 

Operation ↓ Output Batch 

A batch must never simply be overwritten when processed. For example: B-001 100 kg │ ▼ Sorting Operation │ ├── B-002 Grade A 45 kg ├── B-003 Grade B 35 kg ├── B-004 Industrial 15 kg └── Loss 5 kg 

The database must preserve all relationships. 

## **3.5 Core Table: products** 

Stores the master definition of products. 

**Column Type Key Description** id UUID PK Product ID code VARCHAR UNIQUE Product code 

name VARCHAR Product name product_type VARCHAR Fresh / Dried / Freeze-Dried etc. base_unit_id UUID FK Default unit status VARCHAR ACTIVE / INACTIVE created_at TIMESTAMP Creation time updated_at TIMESTAMP Last update 

## **3.6 product_grades** 

Stores configurable grades. 

**Column Type Key** id UUID PK product_id UUID FK code VARCHAR name VARCHAR status VARCHAR sort_order INT 

created_at TIMESTAMP 

updated_a TIMESTAMP t 

Relationship: products 1 ───── N product_grades 

Example: Fresh Truffle ├── A+ ├── A ├── B └── Industrial 

## **3.7 product_sizes** 

Stores configurable product size classifications. 

**Column Type Key** id UUID PK product_id UUID FK code VARCHAR UNIQUE name VARCHAR 

min_value DECIMAL 

max_value DECIMAL 

unit_id UUID FK status VARCHAR 

Example: 

+18g 12–18g <12g 

## **3.8 units** 

**Column Type Key** id UUID PK code VARCHAR UNIQUE name VARCHAR unit_type VARCHAR decimal_precision INT status VARCHAR Examples: 

kg 

g 

piece 

box 

carton 

## **3.9 suppliers** 

**Column Type Key** id UUID PK code VARCHAR UNIQUE name VARCHAR contact_info JSON status VARCHAR created_at TIMESTAMP 

## **3.10 customers** 

**Column Type Key** id UUID PK 

code VARCHAR UNIQUE 

name VARCHAR 

contact_info JSON 

status VARCHAR 

##### **3.10b sites** 

Represents the physical operational sites (Iran factory, Dubai warehouse, Rome warehouse). Every other table's site_id refers to this table. 

Column: id | Type: UUID | Key: PK Column: code | Type: VARCHAR | Key: UNIQUE Column: name | Type: VARCHAR | Key: Column: site_type | Type: VARCHAR | Key: Column: status | Type: VARCHAR | Key: 

Site types: FACTORY WAREHOUSE 

##### **3.11 locations** 

Represents physical operational locations within a site. 

Column: id | Type: UUID | Key: PK Column: code | Type: VARCHAR | Key: UNIQUE Column: site_id | Type: UUID | Key: FK Column: name | Type: VARCHAR | Key: Column: location_type | Type: VARCHAR | Key: Column: parent_location_id | Type: UUID | Key: FK Column: status | Type: VARCHAR | Key: 

Examples: Cold Storage 

Processing Area Washing Area Drying Area Packaging Area Shipping Area 

Hierarchical relationship: locations 1 ───── N locations 

Every location belongs to exactly one site. 

###### 3.12 users 

Column: id | Type: UUID | Key: PK Column: username | Type: VARCHAR | Key: UNIQUE Column: display_name | Type: VARCHAR | Key: Column: home_site_id | Type: UUID | Key: FK, NULLABLE Column: status | Type: VARCHAR | Key: Column: created_at | Type: TIMESTAMP | Key: Column: updated_at | Type: TIMESTAMP | Key: 

home_site_id identifies the user's primary operational site. It is nullable for cross-site roles such as Admin or Auditor. 

Role assignment may be implemented through: roles user_roles if multiple roles per user are required. 

3.13 devices Represents terminals and operational equipment. 

Column: id | Type: UUID | Key: PK Column: serial_number | Type: VARCHAR | Key: UNIQUE Column: site_id | Type: UUID | Key: FK Column: device_type | Type: VARCHAR | Key: Column: name | Type: VARCHAR | Key: Column: location_id | Type: UUID | Key: FK Column: status | Type: VARCHAR | Key: Column: configuration | Type: JSON | Key: Column: created_at | Type: TIMESTAMP | Key: 

A device is always physically installed at exactly one site. 

Device types: ANDROID_SCANNER RASPBERRY_PI SCALE BARCODE_SCANNER LABEL_PRINTER 

3.14 baskets Baskets are physical traceable containers. 

Column: id | Type: UUID | Key: PK Column: serial_number | Type: VARCHAR | Key: UNIQUE Column: site_id | Type: UUID | Key: FK Column: product_id | Type: UUID | Key: FK Column: current_batch_id | Type: UUID | Key: FK Column: current_location_id | Type: UUID | Key: FK Column: status | Type: VARCHAR | Key: Column: created_at | Type: TIMESTAMP | Key: Column: updated_at | Type: TIMESTAMP | Key: 

Important business rule: A basket contains only one product at a time. The basket itself does not replace batch genealogy. A basket belongs to exactly one site and never moves between sites (it is not what transfers — see Chapter B, Internal Transfer workflow). 

3.15 batches This is the central operational entity. 

Column: id | Type: UUID | Key: PK Column: batch_number | Type: VARCHAR | Key: UNIQUE Column: site_id | Type: UUID | Key: FK Column: product_id | Type: UUID | Key: FK Column: grade_id | Type: UUID | Key: FK Column: size_id | Type: UUID | Key: FK Column: quantity | Type: DECIMAL | Key: Column: unit_id | Type: UUID | Key: FK Column: status | Type: VARCHAR | Key: Column: source_type | Type: VARCHAR | Key: 

Column: source_reference_id | Type: UUID | Key: Column: current_location_id | Type: UUID | Key: FK Column: created_at | Type: TIMESTAMP | Key: Column: updated_at | Type: TIMESTAMP | Key: 

Possible source types: RECEIVING PROCESSING_OUTPUT ADJUSTMENT INTERNAL_TRANSFER 

## **3.16 Batch Genealogy Tables** 

To support many-to-many relationships between parent and child batches: 

#### **batch_genealogy** 

|**Column**|**Type**|**Key**|
|---|---|---|
|id|UUID|PK|
|parent_batch_id|UUID|FK|
|child_batch_id|UUID|FK|
|quantity|DECIMAL||
|unit_id|UUID|FK|
|relationship_type|VARCHAR||
|operation_id|UUID|FK|
|created_at|TIMESTAMP||



Relationship: 

batches N ───── N batches 

through batch_genealogy 

This table is mandatory for: 

- Splitting 

- Merging 

- Processing 

- Mixing 

- Transformation 

- Traceability 

3.17 operations Represents every physical processing operation. 

Column: id | Type: UUID | Key: PK Column: operation_number | Type: VARCHAR | Key: UNIQUE Column: site_id | Type: UUID | Key: FK Column: operation_type | Type: VARCHAR | Key: Column: status | Type: VARCHAR | Key: Column: started_at | Type: TIMESTAMP | Key: Column: completed_at | Type: TIMESTAMP | Key: Column: user_id | Type: UUID | Key: FK Column: session_id | Type: UUID | Key: FK Column: device_id | Type: UUID | Key: FK Column: location_id | Type: UUID | Key: FK Column: notes | Type: TEXT | Key: Column: created_at | Type: TIMESTAMP | Key: 

Operation types: RECEIVING SORTING WASHING SLICING FREEZING FREEZE_DRYING CONVENTIONAL_DRYING PACKAGING REPACKAGING ADJUSTMENT 

## **3.18 operation_inputs** 

**Column Type Key** id UUID PK operation_id UUID FK batch_id UUID FK quantity DECIMAL unit_id UUID FK sequence_n INT o 

Relationship: 

operations 1 ───── N operation_inputs 

## **3.19 operation_outputs** 

**Column Type Key** id UUID PK operation_id UUID FK batch_id UUID FK 

quantity DECIMAL unit_id UUID FK output_type VARCHAR sequence_n INT o 

Relationship: 

operations 1 ───── N operation_outputs 

## **3.20 processing_cycles** 

Used for machine-based processes such as freezing and freeze drying. 

|**Column**|**Type**|**Key**|
|---|---|---|
|id|UUID|PK|
|cycle_number|VARCHAR|UNIQUE|
|operation_id|UUID|FK|
|machine_type|VARCHAR||
|machine_referenc<br>e|VARCHAR||
|status|VARCHAR||



planned_start TIMESTAMP actual_start TIMESTAMP actual_end TIMESTAMP parameters JSON created_at TIMESTAMP 

## **3.21 inventory_movements** 

Inventory must be event-based. 

|**Column**|**Type**|**Key**|
|---|---|---|
|id|UUID|PK|
|movement_numbe<br>r|VARCHAR|UNIQUE|
|batch_id|UUID|FK|
|quantity|DECIMAL||
|unit_id|UUID|FK|
|from_location_id|UUID|FK|
|to_location_id|UUID|FK|
|movement_type|VARCHAR||



|operation_id|UUID|FK|
|---|---|---|
|user_id|UUID|FK|
|session_id|UUID|FK|
|created_at|TIMESTAMP||
|Movement types:|||
|RECEIPT|||
|TRANSFER|||
|CONSUMPTION|||
|OUTPUT|||
|ADJUSTMENT|||
|SHIPMENT|||
|RETURN|||



3.22 inventory_balances Stores current inventory state for fast querying. 

Column: id | Type: UUID | Key: PK Column: batch_id | Type: UUID | Key: FK Column: site_id | Type: UUID | Key: FK Column: location_id | Type: UUID | Key: FK Column: quantity | Type: DECIMAL | Key: Column: unit_id | Type: UUID | Key: FK Column: updated_at | Type: TIMESTAMP | Key: 

Important: 

inventory_balances is a current-state projection. inventory_movements is the authoritative movement history. 

## **3.23 packages** 

Packages are individually traceable finished units. 

|**Column**|**Type**|**Key**|
|---|---|---|
|id|UUID|PK|
|serial_number|VARCHAR|UNIQUE|
|product_id|UUID|FK|
|batch_id|UUID|FK|
|quantity|DECIMAL||
|unit_id|UUID|FK|
|package_type|VARCHAR||
|status|VARCHAR||
|current_location_id|UUID|FK|
|created_at|TIMESTAMP||
|updated_at|TIMESTAMP||



## **3.24 cartons** 

Cartons are shipping containers. 

**Column** 

**Type** 

**Key** 

|id|UUID|PK|
|---|---|---|
|carton_number|VARCHAR|UNIQUE|
|carton_type|VARCHAR||
|status|VARCHAR||
|current_location_id|UUID|FK|
|label_status|VARCHAR||
|created_by|UUID|FK|
|created_at|TIMESTAMP||
|updated_at|TIMESTAMP||



## **3.25 carton_packages** 

Many packages may belong to one carton. 

|**Column**|**Type**|**Key**|
|---|---|---|
|id|UUID|PK|
|carton_id|UUID|FK|
|package_i<br>d|UUID|FK|



added_at TIMESTAMP 

added_by UUID FK 

Mandatory constraint: 

UNIQUE(package_id) 

if a package can belong to only one active carton. 

## **3.26 labels** 

**Column Type Key** id UUID PK carton_id UUID FK label_serial VARCHAR UNIQUE label_type VARCHAR status VARCHAR printed_at TIMESTAMP printer_device_id UUID FK created_at TIMESTAMP Label statuses: PENDING 

PRINTING 

PRINTED 

FAILED 

VOID 

## **3.27 label_print_attempts** 

Every print attempt is retained. 

|**Column**|**Type**|**Key**|
|---|---|---|
|id|UUID|PK|
|label_id|UUID|FK|
|attempt_number|INT||
|status|VARCHAR||
|device_id|UUID|FK|
|user_id|UUID|FK|
|idempotency_key|VARCHAR|UNIQUE|
|error_code|VARCHAR||
|error_message|TEXT||
|started_at|TIMESTAMP||



###### completed_at TIMESTAMP 

This table is critical for: 

- Printer failures 

- Reprints 

- Duplicate requests 

- Lost responses 

- Audit 

- Troubleshooting 

###### 3.28 shipments 

Column: id | Type: UUID | Key: PK Column: shipment_number | Type: VARCHAR | Key: UNIQUE Column: source_site_id | Type: UUID | Key: FK Column: dest_site_id | Type: UUID | Key: FK, NULLABLE Column: customer_id | Type: UUID | Key: FK, NULLABLE Column: status | Type: VARCHAR | Key: Column: planned_ship_date | Type: DATE | Key: Column: actual_ship_date | Type: TIMESTAMP | Key: Column: created_by | Type: UUID | Key: FK Column: created_at | Type: TIMESTAMP | Key: Column: updated_at | Type: TIMESTAMP | Key: 

dest_site_id is filled only for an internal transfer between sites; customer_id is filled only for an external shipment to a customer. Exactly one of the two must be set. 

## **3.29 shipment_cartons** 

**Column Type Key** id UUID PK shipment_id UUID FK carton_id UUID FK 

loaded_at TIMESTAMP 

loaded_by UUID FK 

Constraint: 

UNIQUE(carton_id) 

for cartons that cannot belong to multiple active shipments. 

3.30 sessions Represents operational user sessions. 

Column: id | Type: UUID | Key: PK Column: session_number | Type: VARCHAR | Key: UNIQUE Column: site_id | Type: UUID | Key: FK Column: user_id | Type: UUID | Key: FK Column: device_id | Type: UUID | Key: FK Column: role_id | Type: UUID | Key: FK Column: status | Type: VARCHAR | Key: Column: started_at | Type: TIMESTAMP | Key: Column: last_activity_at | Type: TIMESTAMP | Key: Column: closed_at | Type: TIMESTAMP | Key: 

Statuses: CREATED ACTIVE EXPIRED CLOSED 

## **3.31 tasks** 

id 

**Column** 

**Type Key** UUID PK 

|task_number|VARCHAR|UNIQUE|
|---|---|---|
|task_type|VARCHAR||
|status|VARCHAR||
|priority|INT||
|assigned_user_id|UUID|FK|
|assigned_device_i<br>d|UUID|FK|
|entity_type|VARCHAR||
|entity_id|UUID||
|created_at|TIMESTAMP||
|started_at|TIMESTAMP||
|completed_at|TIMESTAMP||



**3.32 exceptions Column Type Key** id UUID PK 

|exception_numbe<br>r|VARCHAR|UNIQUE|
|---|---|---|
|exception_type|VARCHAR||
|severity|VARCHAR||
|status|VARCHAR||
|entity_type|VARCHAR||
|entity_id|UUID||
|detected_by|UUID|FK|
|assigned_to|UUID|FK|
|description|TEXT||
|resolution|TEXT||
|created_at|TIMESTAMP||
|resolved_at|TIMESTAMP||
|Statuses:|||
|OPEN|||
|ACKNOWLEDGED|||
|IN_PROGRESS|||
|RESOLVED|||
|REJECTED|||
|CANCELLED|||



## **3.33 manager_overrides** 

|**Column**|**Type**|**Key**|
|---|---|---|
|id|UUID|PK|
|override_numbe<br>r|VARCHAR|UNIQUE|
|entity_type|VARCHAR||
|entity_id|UUID||
|requested_by|UUID|FK|
|approved_by|UUID|FK|
|reason|TEXT||
|previous_value|JSON||
|requested_value|JSON||
|status|VARCHAR||
|requested_at|TIMESTAMP||
|approved_at|TIMESTAMP||
|executed_at|TIMESTAMP||
|Statuses:|||



REQUESTED 

UNDER_REVIEW APPROVED REJECTED EXECUTED EXPIRED 

## **3.34 audit_logs** 

Audit is append-only. 

|**Column**|**Type**|**Key**|
|---|---|---|
|id|UUID|PK|
|event_id|UUID|UNIQUE|
|user_id|UUID|FK|
|session_id|UUID|FK|
|device_id|UUID|FK|
|action|VARCHAR||
|entity_type|VARCHAR||
|entity_id|UUID||



previous_stat VARCHAR e new_state VARCHAR previous_data JSON new_data JSON ip_address VARCHAR created_at TIMESTAMP 

Audit records must not be physically deleted during normal application operation. 

## **3.35 Configuration Model** 

Configuration must be versioned. 

#### **configuration_groups** 

**Column Type Key** id UUID PK code VARCHAR UNIQUE name VARCHAR description TEXT status VARCHAR Examples: 

PRODUCT 

GRADE SIZE 

PROCESS 

YIELD_TOLERANCE 

PACKAGING 

LABEL 

SHIPPING 

INVENTORY 

## **3.36 configuration_versions** 

|**Column**|**Type**|**Key**|
|---|---|---|
|id|UUID|PK|
|configuration_group_id|UUID|FK|
|version_number|INT||
|status|VARCHAR||
|effective_from|TIMESTAMP||
|effective_to|TIMESTAMP||
|created_by|UUID|FK|
|created_at|TIMESTAMP||



## **3.37 configuration_values** 

**Column Type Key** id UUID PK configuration_version_id UUID FK config_key VARCHAR config_value JSON data_type VARCHAR created_at TIMESTAMP Example: Configuration Group: YIELD_TOLERANCE Version: 12 

Key: WASHING_WEIGHT_INCREASE 

Value: 

8% 

## **3.38 Why Configuration Must Be Versioned** 

Suppose today: 

Washing tolerance = 8% 

and next month: 

Washing tolerance = 12% 

A historical operation from last month must still be evaluated against the configuration applicable at that time. 

Therefore: 

Operation 

↓ 

Configuration Version 12 

must remain traceable. 

Historical configuration must never be silently rewritten. 

## **3.39 Final Relationship Map** 

SUPPLIERS 

│ 

└──────< BATCHES >────── PRODUCTS 

│             │ 



<!-- Start of picture text -->
                │             ├──< GRADES<br>                │             └──< SIZES<br>                │<br>                ├────< BATCH_GENEALOGY >──── BATCHES<br>                │<br>                ├────< OPERATION_INPUTS >──── OPERATIONS<br>                │                                  │<br>                │                                  ├──< OPERATION_OUTPUTS<br>                │                                  │<br>                │                                  └──< PROCESSING_CYCLES<br>                │<br>                ├────< INVENTORY_MOVEMENTS >──── LOCATIONS<br>                │<br>                └────< PACKAGES<br>                           │<br>                           └────< CARTON_PACKAGES >──── CARTONS<br>                                                        │<br>                                                        ├────< LABELS<br>                                                        │          │<br>                                                        │          └────< LABEL_PRINT_ATTEMPTS<br>                                                        │<br>                                                        └────< SHIPMENT_CARTONS >──── SHIPMENTS<br>                                                                                       │<br>                                                                                       └── CUSTOMERS<br><!-- End of picture text -->

USERS │ ├────< SESSIONS ├────< TASKS ├────< EXCEPTIONS ├────< MANAGER_OVERRIDES └────< AUDIT_LOGS 

DEVICES │ ├────< SESSIONS ├────< OPERATIONS └────< LABEL_PRINT_ATTEMPTS 

CONFIGURATION_GROUPS 

│ 

└────< CONFIGURATION_VERSIONS 

│ 

└────< CONFIGURATION_VALUES 

3.39b Multi-Site Data Ownership 

Every site (Iran, Dubai, Rome) runs its own independent instance of this schema in its own local database. site_id on each table always refers to the local site — a site's database never stores another site's site_id as a foreign key target, only as a reference value received via Shipment/Receiving. The Cloud Aggregation layer holds a read-only, periodically-synchronized copy of all sites' data for cross-site reporting; it is never the target of a write transaction. 

## **3.40 Cardinality Summary** 

**Relationship Cardinality** 

Supplier → Batch 1:N Product → Grade 1:N Product → Size 1:N Product → Batch 1:N Batch → Batch Genealogy N:N Operation → Input 1:N Operation → Output 1:N Operation → Cycle 1:0..1 Batch → Inventory Movement 1:N Batch → Package 1:N Carton → Package 1:N Package → Carton 0..1:N Carton → Label 1:N historically / one active Label → Print Attempts 1:N 

|Shipment<br>Carton<br>→|1:N|
|---|---|
|Customer<br>Shipment<br>→|1:N|
|User<br>Session<br>→|1:N|
|User<br>Task<br>→|1:N|
|User<br>Exception<br>→|1:N|
|User<br>Override<br>→|1:N|
|User<br>Audit<br>→|1:N|
|Device<br>Session<br>→|1:N|
|Device<br>Operation<br>→|1:N|
|Confguration Group<br>→<br>Version|1:N|
|Confguration Version<br>→<br>Values|1:N|



## **3.41 State-to-Database Alignment** 

The database does not maintain arbitrary states. 

Each state belongs to a defined state machine. 

###### **Batch** 

DRAFT 

- → AVAILABLE 

- → PARTIALLY_CONSUMED 

- → CONSUMED 

- → CLOSED 

###### **Operation** 

DRAFT 

- → READY 

- → RUNNING 

- → COMPLETING 

→ COMPLETED 

↘ FAILED ↘ CANCELLED 

###### **Package** 

CREATED 

- → FILLED 

- → SEALED 

- → READY_FOR_CARTON 

- → IN_CARTON 

- → SHIPPED 

###### **Carton** 

###### CREATED 

- → PACKING 

- → READY_FOR_LABEL 

- → LABEL_PENDING 

- → PRINTING 

- → LABEL_PRINTED 

- → READY_TO_SHIP 

- → LOADING 

- → SHIPPED 

###### **Shipment** 

DRAFT 

- → READY 

- → LOADING 

- → SHIPPED 

- → COMPLETED 

###### **Exception** 

###### OPEN 

- → ACKNOWLEDGED 

- → IN_PROGRESS 

- → RESOLVED 

###### **Override** 

REQUESTED 

→ UNDER_REVIEW 

→ APPROVED 

→ EXECUTED 

## **3.42 Database Constraints** 

The following constraints are mandatory. 

#### **Unique Constraints** 

products.code 

suppliers.code 

customers.code 

locations.code 

batches.batch_number 

packages.serial_number 

cartons.carton_number 

shipments.shipment_number 

sessions.session_number tasks.task_number 

exceptions.exception_number 

overrides.override_number 

labels.label_serial 

devices.serial_number 

## **3.43 Referential Integrity** 

Foreign keys must be enforced for core relationships. 

Examples: 

batches.product_id 

packages.batch_id carton_packages.carton_id carton_packages.package_id shipment_cartons.shipment_id shipment_cartons.carton_id operation_inputs.operation_id operation_inputs.batch_id operation_outputs.operation_id operation_outputs.batch_id 

## **3.44 Immutability Rules** 

The following must not be physically deleted after being used operationally: 

Batches 

Operations 

Inventory Movements 

Packages 

Cartons 

Shipments 

Labels 

Print Attempts 

Audit Logs Overrides Exceptions 

Historical Configuration Versions 

Instead: 

ACTIVE 

→ INACTIVE 

or: 

VALID 

→ VOID 

or another appropriate terminal state. 

## **3.45 Inventory Integrity Rule** 

The system must never modify inventory simply by changing: inventory_balances.quantity 

Instead: 

Business Event 

↓ 

Inventory Movement 

↓ 

Balance Update 

Example: 

Consume 20 kg 

operation 

↓ 

inventory_movement 

↓ 

inventory_balance - 20 kg 

## **3.46 Traceability Rule** 

Every derived physical unit must have a traceable parent. 

Package 

↓ 

Batch 

↓ 

Operation 

↓ 

Parent Batch 

↓ 

Receiving 

↓ 

Supplier 

A package without valid genealogy is a data-integrity exception. 

## **3.47 Carton Traceability Rule** 

A carton must be traceable through: 

Carton 

↓ 

Packages 

↓ 

Batches 

↓ 

Operations 

↓ 

Receiving 

↓ 

Supplier 

And forward: 

Supplier 

↓ 

Batch 

↓ 

Package 

↓ 

Carton 

↓ 

Shipment 

↓ Customer 

## **3.48 Label Integrity Rule** 

A label belongs to a carton. 

It does NOT represent a new carton. 

Therefore: 

Reprint 

creates: 

label_print_attempt 

not: 

new carton 

This prevents duplicate physical identity. 

## **3.49 Idempotency** 

All operations vulnerable to duplicate network requests must support idempotency. 

Critical examples: 

Receiving confirmation 

Inventory movement 

Carton completion 

Label printing 

Reprint 

Shipment loading 

Manager override execution 

Recommended field: 

idempotency_key 

on transactional/API-sensitive records. 

## **3.50 Concurrency Protection** 

The database must prevent: 

Two operators 

↓ 

consume same inventory 

or: 

Two operators 

↓ 

assign same package 

or: 

Two terminals 

###### ↓ 

complete same carton 

Recommended mechanisms: 

- Unique constraints 

- Row-level locking 

- Transactions 

- Optimistic version checks 

- Idempotency keys 

## **3.51 Soft Delete Policy** 

Master data may be deactivated. 

Example: 

Product A 

ACTIVE 

↓ 

INACTIVE 

Historical transactions remain untouched. 

Operational records must generally not be deleted. 

## **3.52 Audit Requirements** 

The following events require audit: 

- Create 

- Update 

- State transition 

- Inventory adjustment 

- Manager override 

- Label print 

- Label reprint 

- Shipment confirmation 

- Configuration change 

- User permission change 

- Exception resolution 

## **3.53 Scenario-to-Database Mapping** 

###### **Scenario Primary Tables** 

|Receiving|suppliers, batches, operations, inventory_movements|
|---|---|
|Sorting|operations, operation_inputs, operation_outputs, batch_genealogy|
|Washing|operations, operation_inputs, operation_outputs|
|Slicing|operations, operation_inputs, operation_outputs|
|Freezing|operations, processing_cycles|
|Freeze Drying|operations, processing_cycles, batch_genealogy|
|Packaging|packages, operations|
|Cartonization|cartons, carton_packages|
|Label Printing|labels, label_print_attempts|



|Reprint|labels, label_print_attempts|
|---|---|
|Inventory|inventory_movements, inventory_balances|
|Shipping|shipments, shipment_cartons|
|Traceability|batch_genealogy, operations|
|Session|sessions|
|Task|tasks|
|Exception|exceptions|
|Manager Override|manager_overrides|
|Audit|audit_logs|
|Configuration|configuration_groups, configuration_versions, configuration_values|



## **3.54 Business Rule-to-Database Enforcement** 

|**Business Rule**|**Enforcement**|
|---|---|
|Package cannot belong to two<br>|UNIQUE(package_id)|
|cartons||
|Carton cannot ship twice|Shipment relationship constraint|



|Serial must be unique|UNIQUE|
|---|---|
|Negative inventory prohibited|Transaction + validation|
|Invalid product prohibited|FK|
|Invalid batch prohibited|FK|
|Historical data preserved|No hard delete|
|Reprint does not create carton|labels + print_attempts|
|Configuration is historical|versioned configuration|
|Traceability preserved|batch_genealogy|
|Duplicate API request prevented|idempotency|
|Concurrent consumption prevented|transaction/locking|
|Unauthorized override prevented|user/role authorization|
|Audit retained|append-only audit log|



## **3.55 Final Canonical Data Flow** 

SUPPLIER 

│ 

▼ 

RECEIVING OPERATION 

│ 

▼ 

BATCH 

│ 

▼ 

BASKET / STORAGE 

│ 

▼ 

PROCESSING OPERATION 

│ 

├───────────────┐ 

▼               ▼ 

INPUT BATCH     OUTPUT BATCH 

│ 

▼ 

INVENTORY 

│ 

▼ 

PACKAGE 

│ 

▼ 

CARTON 

│ 

▼ 

LABEL 

│ 

▼ 

SHIPMENT 

│ ▼ CUSTOMER 

## **3.56 Final Traceability Graph** 

SUPPLIER 

│ ▼ RECEIVING BATCH 

│ ▼ BATCH B-001 

│ ┌───────┴────────┐ ▼                ▼ 

OPERATION A      OPERATION B 

│                │ ┌─────┴─────┐          │ ▼     ▼     ▼          ▼ B-002 B-003 B-004      B-005 │     │     │          │ └─────┴─────┴──────────┘ 

│ 

PACKAGE 

│ CARTON │ SHIPMENT │ CUSTOMER 

## **3.57 Final ER Model — Implementation Boundary** 

Version 1 should treat the following as the canonical core: 

MASTER 

products 

product_grades 

product_sizes 

units 

suppliers 

customers 

locations 

users 

devices 

TRACEABLE PHYSICAL ENTITIES 

baskets 

batches 

batch_genealogy 

packages 

cartons 

carton_packages 

OPERATIONS 

operations operation_inputs operation_outputs processing_cycles 

###### INVENTORY 

inventory_movements inventory_balances 

SHIPPING 

shipments shipment_cartons 

LABEL 

labels 

label_print_attempts 

CONTROL 

sessions 

tasks 

exceptions manager_overrides audit_logs 

CONFIGURATION configuration_groups configuration_versions configuration_values 

This is the **Version 1 canonical schema boundary** . 

## **3.58 What Must NOT Be Added Without a New Requirement** 

To prevent scope explosion, Version 1 should NOT introduce separate entities for: 

IoT telemetry 

Machine sensor history 

Advanced production planning 

Purchase orders 

Sales orders 

Accounting 

Invoices 

Payments 

CRM 

HR 

Payroll 

Advanced forecasting 

AI recommendations 

Supplier scoring Customer scoring Transport fleet management Customs management 

Advanced quality laboratory management 

These can be future modules without corrupting the core model. 

## **3.59 Final Architecture Principle** 

The final database follows this hierarchy: 

MASTER DATA 

- ↓ 

PHYSICAL IDENTITY 

- ↓ 

BATCH / GENEALOGY 

- ↓ 

###### OPERATIONS 

↓ 

INVENTORY 

↓ 

PACKAGING 

- ↓ 

CARTON 

↓ 

LABEL 

↓ 

SHIPMENT ↓ 

CUSTOMER + 

SESSION TASK EXCEPTION OVERRIDE 

AUDIT 

CONFIGURATION 

The database is therefore not simply an inventory database. 

It is a: 

**Traceable operational event system with inventory state, physical identity, processing genealogy and controlled operational state transitions.** 

## **3.60 Final Consistency Check** 

The schema is considered aligned with the previously defined system documents when: 

Business Workflow 

│ ▼ Business Rules │ ▼ State Machines │ ▼ Scenarios │ ▼ ER Diagram │ ▼ Database Schema │ ▼ API Specification │ ▼ UI / Wireframes 

No API endpoint should create a business state that is not represented by the state machine. No UI action should perform an operation that cannot be represented by the database. No database transaction should destroy traceability required by the business rules. No scenario should require an entity that does not exist in the ER model. 

## **3.61 FINAL STATUS** 

**ER Diagram:** FINAL **Database Schema:** FINAL **Business Rule Alignment:** ALIGNED **State Machine Alignment:** ALIGNED **Scenario Alignment:** ALIGNED **Traceability Model:** ALIGNED **Configuration Model:** VERSIONED **Inventory Model:** EVENT + BALANCE **Label Model:** CARTON-BASED + PRINT ATTEMPTS **Audit Model:** APPEND-ONLY **Version 1 Scope:** CONTROLLED 

# D. Business Rules 

## **04. BUSINESS RULES** 

#### **4.1 Purpose** 

This section defines the business rules governing the Factory Operations, Inventory, Packaging, Traceability, Shipping, Session, Task, Exception, Audit, and Configuration systems. 

These rules are mandatory system behavior. 

The application must not rely solely on UI restrictions. Critical business rules must also be enforced by the backend and, where appropriate, by database constraints. 

## **4.2 Rule Classification** 

Every business rule belongs to one of four categories. 

**Type Meaning** BLOCK Operation must not continue WARNING Operation may continue, but the system records a warning OVERRIDE Operation may continue only after authorized Manager approval INFORMATION System displays information but does not restrict operation 

###### **Example** 

Weight exceeds expected range ↓ 

WARNING 

↓ Operator can continue ↓ Manager can review later 

A warning must not accidentally become a blocking rule. 

## **4.3 Master Data Rules** 

#### **BR-MD-001 — Product Uniqueness** 

Every product must have a unique product code. 

**Action:** BLOCK 

#### **BR-MD-002 — Product Deactivation** 

A product that has historical transactions cannot be physically deleted. 

It may only be deactivated. 

**Action:** BLOCK deletion / ALLOW deactivation 

#### **BR-MD-003 — Grade Ownership** 

A grade belongs to a specific product. 

A grade cannot be assigned to an unrelated product. 

###### **Action:** BLOCK 

#### **BR-MD-004 — Size Ownership** 

A size definition belongs to a specific product. 

###### **Action:** BLOCK 

#### **BR-MD-005 — Configuration Changes** 

Changes to master configuration must not modify historical transactions. 

For example: 

If A+ grade exists today and is renamed later, historical records must retain the original configuration reference. 

**Action:** BLOCK historical modification 

## **4.4 Supplier and Receiving Rules** 

BR-RC-001 — Delivery Requires a Source 

A delivery must have exactly one source: either a valid supplier_id (external receiving) or a reference_shipment_id (internal transfer / customer return). 

Action: BLOCK 

#### **BR-RC-002 — Delivery Number Uniqueness** 

Every delivery must have a unique delivery number. 

**Action:** BLOCK 

#### **BR-RC-003 — Receiving Batch Product** 

Every receiving batch must have exactly one product. 

**Action:** BLOCK 

#### **BR-RC-004 — Basket Product Rule** 

A basket may contain only one product. 

Example: 

Basket B-1001 Product = Fresh Truffle 

The basket cannot subsequently receive strawberry. 

**Action:** BLOCK 

#### **BR-RC-005 — Basket Grade Rule** 

A basket does not have to represent a final quality grade. 

Unsorted incoming material may remain without a final grade. 

**Action:** ALLOW 

#### **BR-RC-006 — Original Receiving Weight** 

The original received weight must never be overwritten. 

The system must preserve: 

Initial Weight Current Weight Weight Adjustments 

**Action:** BLOCK direct overwrite 

#### **BR-RC-007 — Weight Variance** 

If actual received weight differs from expected weight beyond the configured tolerance: 

Expected Weight Actual Weight Tolerance 

the system generates a warning. 

**Action:** WARNING 

#### **BR-RC-008 — Supplier Settlement** 

Supplier settlement must be based on recorded receiving transactions. 

The system must preserve the receiving history used for settlement. 

**Action:** INFORMATION / AUDIT 

## **4.5 Basket Rules** 

#### **BR-BK-001 — Unique Basket Identity** 

Every basket must have a unique basket code. 

**Action:** BLOCK 

#### **BR-BK-002 — Basket Weight** 

Basket current weight may change during operations. 

Original weight remains immutable. 

**Action:** ALLOW controlled update 

#### **BR-BK-003 — Basket Mixing** 

Material from different receiving batches may be moved into the same downstream processing batch if the business workflow allows it. 

However, all parent batches must remain traceable. 

**Action:** ALLOW 

#### **BR-BK-004 — Basket Traceability** 

A basket cannot be deleted once it has participated in an operation. 

**Action:** BLOCK 

## **4.6 Sorting Rules** 

#### **BR-SORT-001 — Sorting Input** 

Sorting may consume material from one or multiple baskets. 

**Action:** ALLOW 

#### **BR-SORT-002 — Sorting Output** 

Sorting output may be divided into different grades and sizes. 

Example: 

Input: 10 kg unsorted truffle 

Output: 4 kg A+ 3 kg A 2 kg B 1 kg Industrial 

Each output must remain traceable to the input. 

**Action:** ALLOW 

#### **BR-SORT-003 — Grade Validation** 

An operator cannot assign a grade that is not configured for the selected product. 

**Action:** BLOCK 

#### **BR-SORT-004 — Size Validation** 

An operator cannot assign a size classification that is not configured for the selected product. 

###### **Action:** BLOCK 

#### **BR-SORT-005 — Sorting Quantity** 

Total output quantity should normally not exceed total input quantity. 

If: 

Output > Input 

the system generates an exception. 

**Action:** BLOCK unless Manager Override 

#### **BR-SORT-006 — Sorting Loss** 

Output may be lower than input. 

The difference is recorded as process loss. 

**Action:** ALLOW + AUDIT 

## **4.7 Washing Rules** 

#### **BR-WASH-001 — Valid Input** 

Only material eligible for washing may be assigned to a washing operation. 

**Action:** BLOCK 

#### **BR-WASH-002 — Weight Increase** 

Washing may cause an increase in measured weight. 

If the increase exceeds the configured expected range: 

###### **Action:** WARNING 

The operation should not automatically be blocked. 

#### **BR-WASH-003 — Washing Output** 

Washed material must create or update a traceable downstream batch. 

**Action:** BLOCK if traceability cannot be established 

BR-WASH-004 — Grade Splitting During Washing 

Washing output may be divided into different grades, exactly as in Sorting (see BR-SORT-002) — e.g. broken material downgraded to a lower grade or Industrial. Each output batch must remain traceable to the input via batch_genealogy. 

###### Action: ALLOW 

## **4.8 Slicing Rules** 

#### **BR-SL-001 — Slicing Input** 

Only compatible products may enter slicing. 

###### **Action:** BLOCK 

#### **BR-SL-002 — Slice Specification** 

Slice thickness must be defined through configuration where the process requires it. 

Example: 

2.0 mm 

**Action:** BLOCK if mandatory configuration is missing 

#### **BR-SL-003 — Slicing Loss** 

Slicing may produce process loss. 

Loss must be recorded. 

**Action:** ALLOW 

#### **BR-SL-004 — Traceability** 

Every sliced output must retain a relationship to its input. 

**Action:** BLOCK if missing 

BR-SL-005 — Grade Splitting During Slicing 

Slicing output may be divided into different grades — e.g. small/broken fragments separated after drying and packaged as Industrial grade, exactly as in Sorting (see BR-SORT-002). Each output batch must remain traceable to the input via batch_genealogy. 

Action: ALLOW 

## **4.9 Freezing Rules** 

#### **BR-FR-001 — Freezing Eligibility** 

Only configured products can enter freezing. 

**Action:** BLOCK 

#### **BR-FR-002 — Freezing Cycle** 

If the freezing machine requires a cycle record, the cycle must be completed before the output is released. 

**Action:** BLOCK 

#### **BR-FR-003 — Cycle Failure** 

A failed machine cycle must not automatically mark the output as completed. 

**Action:** BLOCK 

## **4.10 Freeze-Drying Rules** 

#### **BR-FD-001 — Freeze-Drying Input** 

Only eligible frozen material can enter freeze drying. 

**Action:** BLOCK 

#### **BR-FD-002 — Cycle Identity** 

Every freeze-drying cycle must have a unique cycle number. 

**Action:** BLOCK 

#### **BR-FD-003 — Input Batch Traceability** 

Every cycle must record the input batch or batches. 

**Action:** BLOCK 

#### **BR-FD-004 — Output Batch** 

Every completed cycle must produce an output record. 

**Action:** BLOCK 

#### **BR-FD-005 — Yield Monitoring** 

The system calculates: 

Yield % = 

Output Weight / Input Weight × 100 

If the result falls outside configured limits: 

###### **Action:** WARNING 

The operator may continue unless a specific configured rule requires Manager Override. 

#### **BR-FD-006 — Production Cycle Completion** 

A cycle cannot be marked COMPLETED without: 

- Start time 

- End time 

- Input quantity 

- Output quantity 

- Operator 

- Machine 

###### **Action:** BLOCK 

## **4.11 Conventional Drying Rules** 

#### **BR-CD-001 — Valid Input** 

Only configured products may enter conventional drying. 

###### **Action:** BLOCK 

#### **BR-CD-002 — Drying Output** 

Output must remain linked to the original input. 

###### **Action:** BLOCK 

#### **BR-CD-003 — Yield Monitoring** 

Drying yield is calculated and compared with configured expected ranges. 

Outside-range results generate a warning. 

**Action:** WARNING 

## **4.12 Batch Rules** 

#### **BR-BA-001 — Unique Batch Number** 

Every batch must have a unique batch number. 

###### **Action:** BLOCK 

#### **BR-BA-002 — Batch Product** 

A batch has exactly one product. 

###### **Action:** BLOCK 

#### **BR-BA-003 — Batch Grade** 

A batch may have: 

- No grade 

- One grade 

depending on the process stage. 

A batch cannot have two conflicting grades. 

**Action:** BLOCK 

#### **BR-BA-004 — Batch Genealogy** 

Every derived batch must have a relationship to its source batch or operation. 

**Action:** BLOCK 

#### **BR-BA-005 — Batch Deletion** 

A batch involved in any operation cannot be deleted. 

**Action:** BLOCK 

#### **BR-BA-006 — Batch Consumption** 

A batch cannot be consumed beyond its available quantity. 

Example: Available = 10 kg Consume = 12 kg 

**Action:** BLOCK 

#### **BR-BA-007 — Partial Consumption** 

Partial consumption is allowed. 

Example: 

Batch = 10 kg Operation consumes = 6 kg Remaining = 4 kg 

**Action:** ALLOW 

#### **BR-BA-008 — Multiple Inputs** 

A production operation may consume multiple batches. 

**Action:** ALLOW 

#### **BR-BA-009 — Multiple Outputs** 

A production operation may generate multiple output batches. 

**Action:** ALLOW 

## **4.13 Production Operation Rules** 

#### **BR-OP-001 — Operation Type** 

Every operation must have a valid configured operation type. 

###### **Action:** BLOCK 

#### **BR-OP-002 — Operator** 

An operation must have an identified operator. 

**Action:** BLOCK completion 

#### **BR-OP-003 — Session** 

Operations performed through the operational terminal should be associated with an active session. 

**Action:** BLOCK 

#### **BR-OP-004 — Machine** 

If the operation requires a machine, a valid machine must be assigned. 

**Action:** BLOCK 

#### **BR-OP-005 — Operation Completion** 

An operation cannot be completed without required inputs and outputs. 

**Action:** BLOCK 

#### **BR-OP-006 — Completed Operation** 

A completed operation cannot be edited directly. 

Corrections must be recorded through an adjustment, exception, or Manager Override. 

**Action:** BLOCK direct editing 

## **4.14 Package Rules** 

#### **BR-PK-001 — Unique Package Serial** 

Every package must have a globally unique serial number. 

**Action:** BLOCK 

#### **BR-PK-002 — Package Product** 

A package must contain exactly one configured product. 

**Action:** BLOCK 

#### **BR-PK-003 — Package Weight** 

Actual package weight must be recorded where weight-based packaging is required. 

**Action:** BLOCK completion if mandatory 

#### **BR-PK-004 — Package Batch** 

Every package must reference its source batch. 

**Action:** BLOCK 

#### **BR-PK-005 — Package Status** 

A package cannot be placed in a carton unless it is eligible for packaging. 

**Action:** BLOCK 

## **4.15 Carton Rules** 

#### **BR-CT-001 — Unique Carton Serial** 

Every carton must have a unique carton serial. 

**Action:** BLOCK 

#### **BR-CT-002 — Carton Is Not Scanned** 

The standard carton packaging workflow does not require the operator to scan the empty carton. 

The operator scans packages placed inside the carton. 

**Action:** INFORMATION 

#### **BR-CT-003 — Package Scan** 

Every package added to a carton must be scanned. 

###### **Action:** BLOCK 

#### **BR-CT-004 — Duplicate Package** 

A package cannot be added twice to the same carton. 

###### **Action:** BLOCK 

#### **BR-CT-005 — Package Already in Another Carton** 

A package cannot simultaneously belong to two active cartons. 

###### **Action:** BLOCK 

#### **BR-CT-006 — Carton Composition** 

The system maintains the exact list of packages contained in the carton. 

**Action:** BLOCK completion if composition is missing 

#### **BR-CT-007 — Mixed Products** 

If configuration allows mixed-product cartons, the system may allow them. 

If not configured: 

**Action:** BLOCK 

#### **BR-CT-008 — Mixed Grades** 

Mixed grades inside a carton are allowed only when the carton configuration permits it. 

Otherwise: 

**Action:** BLOCK 

## **4.16 Carton Label Rules** 

#### **BR-LB-001 — Carton Identity Before Printing** 

The carton receives its unique identity before label printing. 

Therefore: 

Carton Created ↓ Carton Serial Assigned ↓ Packages Scanned ↓ Carton Completed ↓ Label Printed 

The label does not create the carton. 

#### **BR-LB-002 — Label Failure** 

If the printer fails: 

Carton = READY Label = PENDING 

The carton remains valid. 

**Action:** ALLOW 

#### **BR-LB-003 — Reprint** 

Reprinting a label does not create a new carton. 

It creates a new print attempt associated with the same label. 

**Action:** ALLOW 

#### **BR-LB-004 — Print History** 

Every print attempt must be recorded. 

**Action:** BLOCK if audit record cannot be created 

#### **BR-LB-005 — Failed Print** 

A failed print attempt must not mark the label as successfully printed. 

**Action:** BLOCK status change 

#### **BR-LB-006 — Successful Reprint** 

If a reprint succeeds: 

Label Status = PRINTED 

The original carton serial remains unchanged. 

## **4.17 Critical Mislabel Prevention Rules** 

This is one of the most important parts of the system. 

#### **BR-LB-007 — Unlabeled Carton Queue** 

If multiple cartons are ready but do not have labels, the system must maintain a queue. 

Example: 

Pending Labels 

CT-000145 CT-000146 CT-000147 CT-000148 

#### **BR-LB-008 — Carton Identification** 

The operator must be able to identify the physical carton before printing its label. 

The UI should display: 

- Carton serial 

- Creation time 

- Package count 

- Total weight 

- Product summary 

- Grade summary 

- Operator 

- Terminal 

- Status 

#### **BR-LB-009 — Print From Carton Context** 

When possible, the label should be printed immediately after carton completion. 

If printing fails, the system must preserve the carton context. 

#### **BR-LB-010 — Reprint Verification** 

For high-risk reprints, the system may require the operator to scan one or more package serials inside the carton before printing. 

This confirms: 

Physical Carton 

↓ 

Package Scan ↓ System Carton ↓ Correct Label 

#### **BR-LB-011 — No Serial Reassignment** 

A label cannot be reassigned from one carton to another. 

###### **Action:** BLOCK 

## **4.18 Inventory Rules** 

#### **BR-IV-001 — Location** 

An inventory object must have a valid location when considered physically stored. 

**Action:** BLOCK 

#### **BR-IV-002 — Negative Inventory** 

Inventory cannot become negative. 

**Action:** BLOCK 

#### **BR-IV-003 — Inventory Movement** 

Every movement must record: 

- Source 

- Destination 

- Quantity 

- User 

- Time 

- Session 

**Action:** BLOCK 

#### **BR-IV-004 — Historical Movement** 

Inventory movement history cannot be deleted. 

**Action:** BLOCK 

#### **BR-IV-005 — Weight Change** 

A weight change must be represented as an operational transaction or adjustment, not an unexplained overwrite. 

**Action:** BLOCK direct overwrite 

## **4.19 Shipping Rules** 

BR-SH-001 — Shipment Destination 

A shipment must have exactly one destination: either a customer_id (external shipment) or a dest_site_id (internal transfer between sites) — never both, never neither. 

Action: BLOCK 

#### **BR-SH-002 — Carton Eligibility** 

Only eligible cartons may be assigned to a shipment. 

Typical requirement: 

Carton Status = READY Label Status = PRINTED 

**Action:** BLOCK 

#### **BR-SH-003 — Duplicate Carton** 

A carton cannot be added twice to the same shipment. 

###### **Action:** BLOCK 

#### **BR-SH-004 — Carton Already Shipped** 

A shipped carton cannot be assigned to another shipment. 

###### **Action:** BLOCK 

#### **BR-SH-005 — Shipment Completion** 

A shipment cannot be completed while required cartons remain unresolved. 

###### **Action:** BLOCK 

#### **BR-SH-006 — Shipping Traceability** 

Every shipped carton must remain traceable to its packages and production batches. 

###### **Action:** BLOCK 

## **4.20 Session Rules** 

#### **BR-SE-001 — One Active Session** 

A user should normally have only one active operational session at a time. 

**Action:** BLOCK / configurable 

#### **BR-SE-002 — Role Selection** 

A session must operate under one active role. 

###### **Action:** BLOCK 

#### **BR-SE-003 — Terminal** 

A session must be associated with a terminal. 

###### **Action:** BLOCK 

#### **BR-SE-004 — Session Expiration** 

Inactive sessions may automatically expire after a configured period. 

**Action:** INFORMATION / configurable 

#### **BR-SE-005 — Session Closure** 

Closing a session does not delete its history. 

**Action:** BLOCK deletion 

## **4.21 Task Rules** 

#### **BR-TK-001 — Task Number** 

Every task has a unique task number. 

**Action:** BLOCK 

#### **BR-TK-002 — Task Role** 

Every task must be associated with an eligible role. 

**Action:** BLOCK 

#### **BR-TK-003 — Task Claim** 

A user may claim a task only if their current role has permission to execute it. 

**Action:** BLOCK 

#### **BR-TK-004 — Task Completion** 

A task cannot be completed unless the required operation is successfully completed. 

**Action:** BLOCK 

#### **BR-TK-005 — Task Cancellation** 

Cancelled tasks remain in history. 

**Action:** BLOCK deletion 

## **4.22 Exception Rules** 

#### **BR-EX-001 — Exception Creation** 

The system may automatically create exceptions from rule violations. 

**Action:** ALLOW 

#### **BR-EX-002 — Exception Severity** 

Exceptions must have a severity: 

LOW MEDIUM 

HIGH CRITICAL 

#### **BR-EX-003 — Warning vs Exception** 

Not every warning requires an exception. 

The system configuration determines which warnings create formal exceptions. 

#### **BR-EX-004 — Exception Resolution** 

A resolved exception must contain: 

- Resolution 

- Resolver 

- Resolution time 

**Action:** BLOCK completion 

## **4.23 Manager Override Rules** 

#### **BR-MO-001 — Authorization** 

Only authorized Manager users may perform Manager Overrides. 

**Action:** BLOCK 

#### **BR-MO-002 — Reason Required** 

Every override requires a reason. 

**Action:** BLOCK 

#### **BR-MO-003 — Before/After State** 

The system must record the state before and after the override. 

###### **Action:** BLOCK 

#### **BR-MO-004 — Override Audit** 

Every override generates an audit event. 

###### **Action:** BLOCK 

#### **BR-MO-005 — Override Does Not Delete History** 

Manager Override may correct business state but must not erase historical events. 

###### **Action:** BLOCK 

## **4.24 Traceability Rules** 

#### **BR-TR-001 — Forward Traceability** 

The system must support: 

Supplier 

- → Delivery 

- → Receiving Batch 

- → Basket 

- → Batch 

- → Operation 

- → Package 

- → Carton 

- → Shipment 

- → Customer 

#### **BR-TR-002 — Backward Traceability** 

The system must support the reverse path. 

Customer 

→ Shipment → Carton → Package → Batch → Operation → Receiving → Supplier 

#### **BR-TR-003 — Transformation Traceability** 

Whenever material changes from one batch to another, the relationship must be recorded. 

**Action:** BLOCK 

#### **BR-TR-004 — Quantity Traceability** 

Where applicable, the quantity transferred between parent and child must be recorded. 

#### **BR-TR-005 — Mixing** 

When multiple input batches are combined: 

Batch A ──┐ ├──→ Batch C Batch B ──┘ 

both parent relationships remain available. 

## **4.25 Audit Rules** 

#### **BR-AU-001 — Important Actions** 

The following actions must be audited: 

- Login 

- Logout 

- Receiving 

- Weight adjustment 

- Batch creation 

- Batch consumption 

- Production completion 

- Package creation 

- Carton completion 

- Label printing 

- Label reprinting 

- Inventory movement 

- Shipment 

- Exception creation 

- Exception resolution 

- Manager Override 

- Configuration change 

#### **BR-AU-002 — Immutable Audit** 

Audit events cannot be edited through the normal application. 

**Action:** BLOCK 

#### **BR-AU-003 — User Identity** 

Audit events must identify the user when applicable. 

#### **BR-AU-004 — Timestamp** 

Audit events must contain server-side timestamps. 

Client-side time must not be trusted as the authoritative event time. 

#### **BR-AU-005 — Terminal** 

Where applicable, audit records should identify the terminal/device used. 

## **4.26 Configuration Rules** 

#### **BR-CF-001 — Configuration Versioning** 

Configuration changes create a new version. 

The old version remains available historically. 

**Action:** BLOCK overwrite 

#### **BR-CF-002 — Effective Date** 

Configuration versions may have an effective date. 

#### **BR-CF-003 — Historical Transactions** 

Historical transactions continue referencing their original configuration context. 

#### **BR-CF-004 — New Grade** 

Adding a new grade does not modify existing batches. 

#### **BR-CF-005 — New Size** 

Adding a new size does not modify historical size classifications. 

#### **BR-CF-006 — Deactivation** 

A configuration item may be deactivated but historical references remain valid. 

## **4.27 Configuration-Driven Rules** 

The following values should NOT be hard-coded into the application: 

- Product grades 

- Product sizes 

- Package formats 

- Carton capacities 

- Weight tolerances 

- Yield tolerances 

- Warning thresholds 

- Task priorities 

- Session timeout 

- Label formats 

- Printer settings 

- Workflow eligibility 

- Machine parameters 

- Allowed mixed-product cartons 

- Allowed mixed-grade cartons 

These values belong in Configuration. 

## **4.28 Warning Rules** 

Warnings should normally not block operations. 

Examples: 

###### **Weight Warning** 

Expected: 10.0 kg Actual:   11.8 kg 

Difference: +18% 

WARNING 

###### **Yield Warning** 

Expected Yield: 18–25% Actual Yield:   31% 

WARNING 

###### **Storage Duration Warning** 

Product has exceeded preferred storage period. 

WARNING 

###### **Process Delay Warning** 

Batch remained unsorted longer than configured target. 

###### WARNING 

The operator may continue unless another rule explicitly requires an override. 

## **4.29 Blocking Rules** 

The following conditions should normally block operations: 

- Invalid product 

- Invalid grade 

- Invalid size 

- Duplicate serial 

- Duplicate package in carton 

- Package already assigned to another carton 

- Negative inventory 

- Missing required input 

- Missing required output 

- Invalid batch genealogy 

- Unauthorized Manager Override 

- Missing required audit record 

- Missing active session 

- Invalid shipment carton 

- Shipping an already shipped carton 

- Completing a required operation without required data 

## **4.30 Override-Required Rules** 

Some exceptional situations should require Manager Override instead of simple blocking. 

Examples: 

- Output quantity significantly exceeds input. 

- Unusual production yield. 

- Manual weight correction beyond configured tolerance. 

- Reopening a completed operational transaction. 

- Shipping a carton with an unresolved warning. 

- Correcting an incorrectly completed batch. 

- Exceptional inventory adjustment. 

The exact list should remain configurable. 

## **4.31 Package-to-Carton Critical Workflow Rule** 

This rule is central to the physical operation. 

The operator does: 

1. Take empty carton 

2. Put package inside 

3. Scan package 

4. Repeat 

5. Finish carton 

6. System generates carton identity 

7. System generates label 

8. Print label 

9. Attach label 

The operator does **not** need to scan the physical empty carton. 

The database records: 

Carton 

↓ 

Package 1 Package 2 Package 3 Package 4 

The carton label represents the already-existing carton record. 

## **4.32 Label Failure Rule** 

If the printer runs out of labels: 

Carton: CT-000145 

Status: READY 

Label: PENDING 

Print: FAILED 

The carton remains valid. 

The operator can later open: Pending Carton Labels 

and see: 

CT-000145 CT-000146 CT-000147 

The system must never create: 

CT-000148 

just because CT-000145 needs a reprint. 

## **4.33 Reprint Safety Rule** 

A reprint is a new **print attempt** , not a new label identity. 

Carton CT-000145 │ └── Label LBL-000145 │ ├── Print Attempt #1 → FAILED ├── Print Attempt #2 → FAILED └── Print Attempt #3 → SUCCESS 

This preserves the entire history. 

## **4.34 Physical Label Identification Rule** 

Because multiple cartons may be waiting for labels, the UI must provide enough information to identify the physical carton. 

Recommended display: 

┌───────────────────────────────────────────┐ │ CARTON CT-000145                           │ │                                           │ │ Created: 14:32                             │ │ Operator: Ali                              │ │ Terminal: PKG-02                           │ │ Packages: 6                                │ │ Weight: 2.84 kg                            │ │ Product: Freeze-Dried Truffle              │ │ Grade: A                                   │ │                                           │ │ [ PRINT LABEL ]                            │ │ [ VERIFY PACKAGES ]                       │ └───────────────────────────────────────────┘ 

This significantly reduces the probability of applying the wrong label. 

## **4.35 Label Reprint Verification Rule** 

For a carton selected from the pending-label list, the system may require package verification. 

Example: 

System: Scan one package from this carton. 

Operator: Scan PK-009823 

System: ✓ Package belongs to CT-000145 

[ PRINT LABEL ] 

If the scanned package belongs to another carton: 

✕ Package belongs to CT-000147 

PRINT BLOCKED 

This is the preferred safeguard when physical carton identification is uncertain. 

## **4.36 Data Ownership Rules** 

Each type of data has a primary owner. 

###### **Data Owner** 

Product Administrator / Manager Grade Administrator / Manager 

|Size|Administrator / Manager|
|---|---|
|Supplier|Management|
|Receiving|Receiving Operator|
|Basket|Receiving / Warehouse|
|Batch|Production|
|Sorting Result|Sorting Operator|
|Washing|Washing Operator|
|Slicing|Slicing Operator|
|Freeze Cycle|Production Operator|
|Package|Packaging Operator|
|Carton|Packaging Operator|
|Shipment|Shipping Operator|
|Inventory|Warehouse|
|Configuration|Administrator / Manager|
|Override|Manager|
|Audit|System|



###### 4.36b Site Ownership Rules 

BR-SITE-001 — Physical Inventory Ownership 

Each site (Iran, Dubai, Rome) has exclusive write access to inventory physically located at that site. No site may directly modify a batch, basket, or inventory record whose site_id belongs to another site. 

Action: BLOCK 

###### BR-SITE-002 — Cross-Site Transfer 

Inventory may only move between sites through a Shipment (source site) paired with a matching Receiving (destination site, source = INTERNAL_TRANSFER). There is no other mechanism for one site to gain ownership of another site's inventory. Action: BLOCK any transfer that bypasses this path 

BR-SITE-003 — Cloud Aggregation Is Read-Only 

The Cloud Aggregation layer never accepts write transactions. It only reflects data already 

committed at a site's local database. Action: BLOCK any write attempt against Cloud Aggregation 

## **4.37 Concurrency Rules** 

The system must protect against two operators performing conflicting operations simultaneously. 

Examples: 

###### **Same Package** 

Two operators cannot add the same package to different cartons at the same time. 

###### **Same Batch** 

Two operations cannot consume more material than the batch contains. 

###### **Same Carton** 

Two terminals should not simultaneously modify the same carton. 

###### **Same Configuration** 

Two administrators modifying the same configuration item must not silently overwrite each other's changes. 

These conditions should be handled through transactional database locking or optimistic concurrency control. 

## **4.38 Offline / Network Failure Rules** 

If a terminal temporarily loses network connectivity: 

The application must not falsely report an operation as completed unless the transaction has been confirmed by the server. 

For critical operations: 

Client 

↓ 

Request ↓ Server 

↓ Transaction committed 

↓ 

Confirmation ↓ 

UI = SUCCESS 

If confirmation is missing: 

STATUS = PENDING 

rather than assuming success. 

This is particularly important for: 

- Package scanning 

- Carton composition 

- Label printing 

- Inventory movement 

- Shipping 

## **4.39 Duplicate Request Protection** 

Critical API operations should support idempotency. 

Example: 

If an operator accidentally presses: 

COMPLETE CARTON 

twice, the system must not create two cartons. 

The operation should use an idempotency key or equivalent mechanism. 

## **4.40 Audit vs Business History** 

These are different concepts. 

###### **Business History** 

Answers: 

What happened to the product? 

Examples: 

Batch A → Batch B Package → Carton Carton → Shipment 

###### **Audit History** 

Answers: 

Who did what and when? 

Examples: 

Ali completed carton CT-00145 at 14:32 Mohammad approved override OV-00022 at 15:10 

Both must exist. 

## **4.41 Core Invariants** 

The following invariants must always remain true. 

###### **INV-001** 

A package cannot belong to two active cartons. 

###### **INV-002** 

A carton cannot belong to two active shipments. 

###### **INV-003** 

Inventory cannot become negative. 

###### **INV-004** 

A batch cannot be consumed beyond available quantity. 

###### **INV-005** 

A derived batch must have traceable genealogy. 

###### **INV-006** 

A shipped carton must have a valid label. 

###### **INV-007** 

A Manager Override must identify the approving manager. 

###### **INV-008** 

A completed transaction cannot be silently modified. 

###### **INV-009** 

Serial numbers cannot be reused. 

###### **INV-010** 

Audit events cannot be silently deleted. 

## **4.42 Rule Priority** 

When multiple rules apply, the system follows this priority: 

BLOCK ↓ OVERRIDE ↓ WARNING ↓ INFORMATION 

Example: 

Weight outside expected range 

↓ WARNING 

But if weight is physically impossible 

↓ BLOCK 

## **4.43 Business Rule Engine Philosophy** 

The application should not contain hundreds of hard-coded if/else statements for business configuration. 

Instead: 

Business Rule ↓ Rule Type ↓ Condition 

↓ Threshold / Configuration 

↓ Action 

Example: 

RULE: Freeze Dry Yield 

CONDITION: Yield < Minimum Yield 

THRESHOLD: 15% 

ACTION: WARNING 

This makes the system adaptable without rewriting the application. 

## **4.44 Rule IDs** 

Every important business rule has a unique identifier. 

Recommended naming: 

BR-MD-*   Master Data BR-RC-*   Receiving BR-BK-*   Basket BR-SORT-* Sorting BR-WASH-* Washing BR-SL-*   Slicing BR-FR-*   Freezing BR-FD-*   Freeze Drying BR-CD-*   Conventional Drying BR-BA-*   Batch BR-OP-*   Operations BR-PK-*   Package BR-CT-*   Carton BR-LB-*   Label BR-IV-*   Inventory BR-SH-*   Shipping BR-SE-*   Session BR-TK-*   Task BR-EX-*   Exception BR-MO-*   Manager Override BR-TR-*   Traceability BR-AU-*   Audit BR-CF-*   Configuration 

This allows the API, UI, audit logs, tests, and developer documentation to reference the exact same rule. 

## **4.45 Final Business Rule Architecture** 

The final decision model is: 



<!-- Start of picture text -->
                        OPERATION<br>                             │<br>                             ▼<br>                     BUSINESS RULES<br>                             │<br>              ┌──────────────┼──────────────┐<br>              │              │              │<br>              ▼              ▼              ▼<br>            BLOCK         WARNING        OVERRIDE<br>              │              │              │<br>              ▼              ▼              ▼<br>          Stop Action     Continue      Manager<br>                          + Record       Approval<br>                             │              │<br>                             └──────┬───────┘<br>                                    ▼<br>                                  AUDIT<br>                                    │<br>                                    ▼<br>                              TRACEABILITY<br><!-- End of picture text -->

The system therefore separates four things that must not be confused: 

1. **Business transaction** — what happened. 

2. **Business rule** — whether it was allowed. 

3. **Audit** — who performed it. 

4. **Traceability** — what happened to the physical product. 

This separation is critical. If these four concepts are mixed together, the system will become difficult to maintain and impossible to audit reliably. 

# E. UI / Wireframes 

## **1. UI Navigation Map** 

#### **1.1 Purpose** 

This document defines the navigation structure of the Warehouse and Production Management System. 

It identifies all major screens, their relationships, and how users navigate through the system. 

The objective is to ensure a consistent user experience across the Web Application, Raspberry Pi Terminals, and Android Industrial PDAs. 

## **1.2 Client Applications** 

The system consists of three user interfaces: 

+--------------------------------+ 

| Web Application                | | Managers / Supervisors / Admin | +--------------------------------+ +--------------------------------+ | Raspberry Pi Terminal          | | Weighing & Label Printing      | +--------------------------------+ +--------------------------------+ | Android PDA                    | | Mobile Operations              | +--------------------------------+ 

Each client exposes only the screens relevant to its purpose. 

1.3 Web Application Navigation Login │ ▼ Select Site (skipped if user has only one site) 

│ ▼ Dashboard │ ├── Receiving ├── Inventory ├── Production ├── Packaging ├── Shipping ├── Tasks ├── Reports ├── Cross-Site Reports (Cloud Aggregation, read-only) ├── Traceability ├── Print Queue ├── Notifications ├── Configuration ├── Users ├── Roles ├── Devices └── Audit 

The Dashboard serves as the entry point after login. Users with access to more than one site (e.g. Admin, Auditor) can switch sites from the header at any time; all screens except Cross-Site Reports always reflect the currently selected site only. 

## **1.4 Dashboard Navigation** 

Dashboard │ ├── My Tasks ├── Today's Production ├── Inventory Summary ├── Active Sessions ├── Equipment Status ├── Pending Labels ├── Active Warnings ├── Reports └── Quick Actions 

Managers and supervisors receive a broader overview, while operators see only relevant information. 

## **1.5 Receiving Module** 

Receiving │ 

├── New Receiving Session 

├── Active Sessions 

├── Receiving History 

- ├── Batch Details 

- └── Weight History 

Flow: 

Receiving 

↓ 

Create Session 

↓ 

Scan Basket 

↓ 

Record Weight 

↓ 

Save Batch 

↓ 

Move to Cold Storage 

## **1.6 Inventory Module** 

Inventory │ 

├── Inventory List ├── Basket Details 

├── Batch Details ├── Search ├── Zone View ├── Movement History └── Timeline 

## **1.7 Production Module** 

Production │ ├── Sorting ├── Washing ├── Slicing ├── Freezing ├── Freeze Drying ├── Conventional Drying └── Production History 

Each production process has its own execution screen. 

## **1.8 Packaging Module** 

Packaging │ ├── Consumer Packages ├── Carton Builder 

├── EPS Builder ├── Pallet Builder ├── Package History └── Repacking 

Flow: 

Package 

↓ 

Scan Products 

###### ↓ 

Validate 

###### ↓ 

Complete Package 

###### ↓ 

Print Label 

## **1.9 Shipping Module** 

Shipping │ ├── New Shipment ├── Shipment Builder ├── Shipment History └── Ready for Dispatch 

## **1.10 Task Center** 

Tasks │ ├── My Tasks ├── Available Tasks ├── Assigned Tasks(Manager/Supervisor only) ├── Completed Tasks └── Suspended Tasks 

Operators primarily work from **My Tasks** . 

## **1.11 Traceability Module** 

Traceability │ ├── Search 

├── Batch Genealogy 

├── Package History 

├── Timeline 

- ├── Forward Trace 

- └── Backward Trace 

Users can search by: 

- Basket QR 

- Batch Number 

- Package QR 

- Carton Number 

- Shipment Number 

## **1.12 Reporting Module** 

Reports │ ├── Inventory ├── Receiving ├── Production ├── Packaging ├── Shipment ├── Traceability 

├── Weight History └── Audit 

1.13 Configuration Module Configuration │ ├── Sites ├── Products 

- ├── Grades 

- ├── Sizes 

- ├── Zones ├── Package Types 

├── Processes ├── Devices ├── Roles ├── Users ├── Validation Rules └── System Settings 

Only administrators have write access. Sites is managed centrally and is the only configuration item that is not site-specific. 

Only administrators have write access. 

## **1.14 Print Queue** 

Print Queue │ ├── Pending Labels ├── Failed Prints ├── Reprint └── Print History 

Managers can monitor and reprint labels when required. 

## **1.15 Audit Module** 

Audit │ ├── User Activity 

├── Device Activity ├── Session History ├── Configuration Changes └── Event Log 

## **1.16 Raspberry Pi Navigation** 

The Raspberry Pi Terminal is optimized for fixed production stations. 

Login 

↓ 

Select Role 

↓ 

Home 

├── Start Session ├── Scan Basket ├── Read Weight ├── Print Label ├── Pending Labels ├── Recover Session └── Logout 

This interface is intentionally minimal to support fast production. 

## **1.17 Android PDA Navigation** 

The Android PDA is optimized for mobile operators. 

Login 

↓ 

Select Role 

↓ 

Home 

├── My Tasks ├── Scan QR 

├── Recommended Tasks ├── Active Session ├── Notifications └── Logout 

The PDA does not support label printing. 

## **1.18 QR-Based Navigation** 

Scanning a QR code automatically opens the appropriate screen. Examples: 

**QR Type Opens** Basket Basket Details / Current Task Batch Batch Timeline Package Package Details Carton Carton Details EPS Box EPS Details Pallet Pallet Details 

This minimizes manual navigation during production. 

## **1.19 Role-Based Navigation** 

Each role sees only the menus relevant to its responsibilities. Example: 

###### **Receiving Operator** 

Dashboard 

↓ 

Receiving 

###### ↓ 

My Tasks 

↓ 

Logout 

###### **Packaging Operator** 

Dashboard 

↓ 

Packaging 

↓ 

My Tasks 

↓ 

Print Queue 

↓ 

Logout 

###### **Factory Manager** 

Dashboard 

↓ 

All Operational Modules 

↓ 

Reports 

↓ 

Traceability 

↓ 

Configuration (Read Only) 

↓ 

Logout 

## **1.20 Navigation Principles** 

The user interface follows these principles: 

- Maximum three clicks to reach any operational function. 

- Large buttons for industrial environments. 

- QR scanning preferred over manual data entry. 

- Context-sensitive actions based on role and object status. 

- Consistent navigation across all clients. 

- Minimal typing by operators. 

- Immediate feedback after every action. 

## **1.21 Screen Inventory** 

###### **Web Application** 

|**Screen**||**Approx.**|
|---|---|---|
|**Group**||**Screens**|
|Dashboard|5||
|Receiving|6||
|Inventory|8||
|Production|10||



|Packaging|8|
|---|---|
|Shipping|5|
|Tasks|5|
|Reports|8|
|Traceability|6|
|Configuration|12|
|Users & Roles|4|
|Devices|4|
|Print Queue|3|
|Audit|5|
|Notifications|2|



###### **Total Web Screens:** ~91 

###### **Raspberry Pi** 

|**Screen**<br>**Group**||**Approx.**<br>**Screens**|
|---|---|---|
|Login|1||
|Role Selection|1||
|Home|1||
|Session|5||
|Weighing|2||
|Printing|3||
|Recovery|1||



###### **Total Raspberry Screens:** ~14 

###### **Android PDA** 

**Screen Group Approx. Screens** Login 1 Role Selection 1 Home 1 My Tasks 2 Scan Workflow 6 Active Session 2 Notifications 1 

###### **Total Mobile Screens:** ~14 

## **1.22 Navigation Summary** 

The navigation structure is organized around the operational flow of the factory rather than technical modules. 

Users enter through a role-specific dashboard, access only the functions required for their responsibilities, and perform most production activities through task-driven or QR-driven workflows. 

This approach minimizes operator training, reduces navigation complexity, and provides a consistent experience across web, fixed terminals, and mobile devices while supporting the complete operational lifecycle defined for Version 1. 

# F. API Specification 

## **1. API Specification** 

#### **1.1 Purpose** 

This document defines the REST API specification for Version 1 of the Warehouse and Production Management System. 

The API serves as the communication layer between: 

- Web Application 

- Raspberry Pi Terminals 

- Android Industrial PDA 

- Future External Systems 

All business operations must be performed through the API. 

Clients shall never access the database directly. 

## **1.2 Architecture** 

Client │ HTTPS │ REST API │ Business Services │ Database 

###### 1.3 Base URL 

Each site runs its own local API server: 

<u>https://iran.api.company.com/api/v1/ https://dubai.api.company.com/api/v1/ https://rome.api.company.com/api/v1/</u> 

A client always talks to its own site's server for all read/write operations. A separate read-only endpoint serves cross-site reporting: 

###### <u>https://cloud.api.company.com/api/v1/reports/</u> 

The Cloud Aggregation endpoint accepts GET requests only — no POST/PUT/DELETE. 

1.4 Authentication 

Authentication uses JWT. Tokens are site-scoped: a token issued by one site's server is not valid on another site's server. Login POST /auth/login 

Request { "username":"operator1", "password":"********" } 

Response { "accessToken":"...", "refreshToken":"...", "expiresIn":3600, "siteCode":"IRAN" } 

###### **Refresh Token** 

POST /auth/refresh 

###### **Logout** 

POST /auth/logout 

###### **Current User** 

GET /auth/me 

## **1.5 Common Response Format** 

Success 

{ "success": true, "data": { } } 

Error 

{ "success": false, "message": "Validation Error", "errors":[] } 

## **1.6 Master Data APIs** 

Products 

GET    /products GET    /products/{id} POST   /products PUT    /products/{id} DELETE /products/{id} 

Grades 

GET /grades POST /grades PUT /grades/{id} 

Sizes 

GET /sizes POST /sizes PUT /sizes/{id} 

Suppliers 

GET /suppliers POST /suppliers PUT /suppliers/{id} 

Zones 

GET /zones POST /zones PUT /zones/{id} 

Package Types 

GET /package-types POST /package-types 

Devices 

GET /devices POST /devices PUT /devices/{id} 

## **1.7 Receiving APIs** 

Create Receiving Session 

POST /receiving/sessions 

Start Session 

POST /receiving/sessions/{id}/start 

Scan Basket 

POST /receiving/scan-basket 

Record Weight 

POST /receiving/weight 

Complete Receiving 

POST /receiving/complete 

Receiving History 

GET /receiving 

Receiving Details 

GET /receiving/{id} 

## **1.8 Inventory APIs** 

Inventory 

GET /inventory 

Batch Details 

GET /inventory/batches/{id} 

Container Details 

GET /inventory/containers/{id} 

Move Container 

POST /inventory/move 

Inventory Search 

GET /inventory/search 

Weight History 

GET /inventory/batches/{id}/weights 

Timeline 

GET /inventory/batches/{id}/timeline 

## **1.9 Production APIs** 

Create Production Session 

POST /production/session 

Sorting 

POST /production/sorting 

Washing 

POST /production/washing 

Slicing 

POST /production/slicing 

Freezing 

POST /production/freezing 

Freeze Drying 

POST /production/freeze-drying 

Conventional Drying 

POST /production/drying 

Complete Production 

POST /production/complete 

## **1.10 Packaging APIs** 

Create Package 

POST /packages 

Scan Product Package 

POST /packages/scan 

Complete Carton 

POST /packages/carton/complete 

Complete EPS Box 

POST /packages/eps/complete 

Package Details 

GET /packages/{id} 

Package Timeline 

GET /packages/{id}/timeline 

## **1.11 Shipping APIs** 

Create Shipment 

POST /shipments 

Add Package 

POST /shipments/add-package 

Complete Shipment 

POST /shipments/complete 

Shipment List 

GET /shipments 

Shipment Details 

GET /shipments/{id} 

## **1.12 Task APIs** 

My Tasks 

GET /tasks/my 

Available Tasks 

GET /tasks 

Task Details GET /tasks/{id} 

Start Task 

POST /tasks/{id}/start 

Complete Task 

POST /tasks/{id}/complete 

Suspend Task 

POST /tasks/{id}/pause 

Resume Task 

POST /tasks/{id}/resume 

Cancel Task 

POST /tasks/{id}/cancel 

Assign Task POST /tasks/{id}/assign 

Request { "assignedUserId": "..." } 

## **1.13 Session APIs** 

Create Session 

POST /sessions 

Resume Session 

POST /sessions/{id}/resume 

Suspend Session 

POST /sessions/{id}/pause 

Complete Session 

POST /sessions/{id}/complete 

Recover Session 

GET /sessions/recover 

## **1.14 Print APIs** 

Print Label 

POST /print 

Reprint Label 

POST /print/reprint 

Pending Labels 

GET /print/pending 

Print History 

GET /print/history 

Printer Status 

GET /printers 

## **1.15 QR APIs** 

Scan QR 

POST /qr/scan 

The response determines the object type automatically. 

Example: 

{ 

- "objectType":"Basket", 

"objectId":"BASKET-104", "status":"Cold Storage", "nextOperations":[ "Sorting" ] } 

## **1.16 Traceability APIs** 

Forward Trace 

GET /trace/batch/{id}/forward 

Backward Trace 

GET /trace/package/{id}/backward 

Batch Genealogy 

GET /trace/batch/{id}/genealogy 

Timeline 

GET /trace/{id}/timeline 

## **1.17 Configuration APIs** 

Products 

GET /config/products 

Grades 

GET /config/grades 

Sizes 

GET /config/sizes 

Processes 

GET /config/processes 

Roles 

GET /config/roles 

Validation Rules 

GET /config/validation 

Update Configuration 

PUT /config/{module} 

## **1.18 Reporting APIs** 

Inventory Report 

GET /reports/inventory 

Production Report 

GET /reports/production 

Receiving Report 

GET /reports/receiving 

Shipment Report 

GET /reports/shipment 

Traceability Report 

GET /reports/traceability 

Audit Report 

GET /reports/audit 

## **1.19 Mobile PDA Workflow APIs** 

Operator Login 

POST /mobile/login 

Select Role 

POST /mobile/select-role 

My Tasks GET /mobile/tasks 

Scan QR POST /mobile/scan 

Confirm Operation POST /mobile/confirm 

Next Recommended Task 

GET /mobile/next-task 

## **1.20 Raspberry Terminal APIs** 

Read Scale 

GET /terminal/scale 

Capture Weight 

POST /terminal/weight 

Print Label 

POST /terminal/print 

Device Status 

GET /terminal/status 

Heartbeat 

POST /terminal/heartbeat 

## **1.21 Notification APIs** 

Notifications 

GET /notifications 

Mark Read 

POST /notifications/read 

Warning List 

GET /warnings 

Exception List 

GET /exceptions 

## **1.22 Audit APIs** 

Audit History 

GET /audit 

User Activity 

GET /audit/users/{id} 

Device Activity 

GET /audit/devices/{id} 

Session History 

GET /audit/sessions/{id} 

## **1.23 HTTP Status Codes** 

**Code Meaning** 

200 Success 

- 201 Created 

- 204 No Content 

- 400 Validation Error 

- 401 Unauthorized 

- 403 Forbidden 

- 404 Not Found 

- 409 Conflict 

422 Business Rule Violation 

500 Internal Server Error 

## **1.24 API Versioning** 

The API is versioned using the URL. 

Examples: 

/api/v1/ /api/v2/ 

Future versions should remain backward compatible whenever possible. 

## **1.25 API Design Principles** 

The Version 1 API follows these principles: 

- RESTful resource-based endpoints. 

- Stateless requests using JWT authentication. 

- JSON for all request and response payloads. 

- Consistent response structure. 

- Business validation performed on the server. 

- No direct database access from clients. 

- Idempotent GET, PUT, and DELETE operations where applicable. 

- All write operations recorded in the audit trail. 

- Designed for Web, Raspberry Pi, and Android PDA clients. 

This API provides a stable integration layer for the Version 1 platform while allowing future modules and external systems to connect without changes to the core application architecture. 

# G. State Machines 

## **07. STATE MACHINES** 

#### **Status Definitions & Transition Rules — Final v1.0** 

## **7.1 Purpose** 

This section defines the state machines governing the lifecycle of the major operational entities in the system. 

A state represents the current business condition of an entity. 

A transition represents an authorized movement from one state to another. 

The system must never allow arbitrary status changes. 

Current State ↓ Transition Request ↓ Permission Check ↓ Business Rule Validation ↓ Required Data Validation ↓ State Transition ↓ Audit Event 

A transition is successful only when all required conditions are satisfied. 

## **7.2 General State Machine Principles** 

#### **SM-GEN-001 — No Arbitrary Status Editing** 

Users must not directly edit an entity's status. 

Status changes occur only through defined transitions. 

#### **SM-GEN-002 — Valid Transition Only** 

Every transition must have: 

- Source State 

- Target State 

- Trigger 

- Required Conditions 

- Authorized Role 

- Validation Rules 

- Audit Event 

#### **SM-GEN-003 — Invalid Transition** 

Any undefined transition must be rejected. 

BLOCK 

#### **SM-GEN-004 — Historical State** 

Every state transition must be recorded in state history. 

At minimum: 

Entity Previous State New State User Timestamp Reason Session Terminal 

#### **SM-GEN-005 — Server Authority** 

The server is authoritative for state. 

The client may request a transition but cannot declare it successful. 

## **7.3 Receiving Batch State Machine** 

#### **7.3.1 States** 

DRAFT RECEIVING RECEIVED AVAILABLE PARTIALLY_CONSUMED CONSUMED CLOSED CANCELLED 

###### **Lifecycle** 

DRAFT ↓ RECEIVING ↓ RECEIVED ↓ AVAILABLE ↓ PARTIALLY_CONSUMED ↓ CONSUMED ↓ CLOSED 

Alternative: 

DRAFT → CANCELLED RECEIVED → CANCELLED 

Cancellation is only permitted when no irreversible downstream activity has occurred. 

#### **7.3.2 Transitions** 

|**From**|**To**|**Trigger**|**Required**|
|---|---|---|---|
|DRAFT|RECEIVING|Start<br>Receiving|Valid<br>supplier/product|
|RECEIVING|RECEIVED|Complete<br>Receiving|Weight +<br>operator|
|RECEIVED|AVAILABLE|Confirm|Valid receiving|
|AVAILABLE|PARTIALLY_CONSUMED|Partial<br>consumption|Quantity<br>available|
|AVAILABLE|CONSUMED|Full<br>consumption|Quantity =<br>available|
|PARTIALLY_CONSUMED|PARTIALLY_CONSUMED|Additional<br>consumption|Quantity<br>available|
|PARTIALLY_CONSUMED|CONSUMED|Final<br>consumption|Remaining = 0|
|CONSUMED|CLOSED|Close batch|No remaining<br>operations|
|DRAFT|CANCELLED|Cancel|Authorized user|
|RECEIVED|CANCELLED|Cancel|No irreversible<br>usage|



## **7.4 Basket State Machine** 

#### **States** 

EMPTY RECEIVING FILLED 

AVAILABLE IN_PROCESS EMPTYING EMPTY DAMAGED RETIRED 

###### **Lifecycle** 

EMPTY ↓ RECEIVING ↓ FILLED ↓ AVAILABLE ↓ IN_PROCESS ↓ EMPTYING ↓ EMPTY 

#### **Transition Rules** 

###### **EMPTY → RECEIVING** 

Triggered when material begins entering basket. 

Required: 

- Basket exists 

- Basket is active 

- Product selected 

###### **RECEIVING → FILLED** 

Triggered when receiving is completed. 

Required: 

- Weight recorded 

- Product recorded 

- Source recorded 

###### **FILLED → AVAILABLE** 

Basket is ready for downstream processing. 

###### **AVAILABLE → IN_PROCESS** 

Basket is assigned to an operation. 

###### **IN_PROCESS → EMPTYING** 

Processing begins removing material. 

###### **EMPTYING → EMPTY** 

All material has been removed. 

###### **Any Active State → DAMAGED** 

Only if basket becomes physically unusable. 

Requires: 

- Reason 

- User 

###### **DAMAGED → RETIRED** 

Basket is permanently removed from operational use. 

## **7.5 Processing Operation State Machine** 

Applies to: 

- Sorting 

- Washing 

- Slicing 

- Freezing 

- Freeze Drying 

- Conventional Drying 

- Other configured operations 

#### **States** 

PLANNED READY IN_PROGRESS PAUSED COMPLETING COMPLETED FAILED CANCELLED 

#### **Lifecycle** 

PLANNED 

↓ 

READY 

↓ 

IN_PROGRESS 

↓ COMPLETING 

↓ COMPLETED 

Alternative: 

IN_PROGRESS → PAUSED → IN_PROGRESS IN_PROGRESS → FAILED PLANNED → CANCELLED READY → CANCELLED 

#### **PLANNED → READY** 

Conditions: 

- Required inputs available 

- Required configuration exists 

- Authorized operator/session 

#### **READY → IN_PROGRESS** 

Triggered when operator starts operation. 

Required: 

- Active session 

- Authorized role 

- Valid machine if required 

#### **IN_PROGRESS → PAUSED** 

Allowed when operation supports pause. 

Requires pause reason if configured. 

#### **PAUSED → IN_PROGRESS** 

Operator resumes operation. 

#### **IN_PROGRESS → COMPLETING** 

Operator requests completion. 

System validates: 

- Inputs 

- Outputs 

- Weight 

- Required measurements 

- Machine information 

- Operator 

#### **COMPLETING → COMPLETED** 

Only if all required validation passes. 

This transition creates: 

- Output records 

- Inventory movements 

- Genealogy 

- Audit event 

#### **IN_PROGRESS → FAILED** 

Triggered by: 

- Machine failure 

- Process failure 

- Operator failure 

- Other configured exception 

A failed operation cannot be marked completed without an approved recovery process. 

## **7.6 Sorting State Machine** 

Sorting uses the Processing Operation State Machine. 

Additional business condition: 

Input 

↓ Sorting 

↓ 

Output Grade/Size Batches 

Completion requires reconciliation: 

Total Output + Recorded Loss 

≈ 

Total Input 

within configured tolerance. 

If outside tolerance: 

WARNING 

or OVERRIDE 

depending on configuration. 

## **7.7 Washing State Machine** 

PLANNED 

↓ 

READY 

###### ↓ 

IN_PROGRESS 

###### ↓ 

COMPLETING 

###### ↓ 

COMPLETED 

Weight increase is allowed. 

Example: 

Input = 100 kg Output = 112 kg 

This is not automatically an error. 

If gain exceeds configured threshold: 

WARNING 

## **7.8 Slicing State Machine** 

PLANNED 

↓ 

READY 

↓ 

IN_PROGRESS 

↓ 

COMPLETING 

↓ 

COMPLETED 

Required completion data may include: 

- Input batch 

- Output batch 

- Slice specification 

- Quantity 

- Operator 

- Machine 

## **7.9 Freezing State Machine** 

#### **States** 

PLANNED READY LOADING RUNNING COMPLETING COMPLETED FAILED 

CANCELLED 

Lifecycle: 

PLANNED ↓ READY ↓ LOADING ↓ RUNNING ↓ COMPLETING ↓ COMPLETED 

Failure: 

RUNNING → FAILED 

A failed cycle cannot become COMPLETED directly. 

## **7.10 Freeze-Drying Cycle State Machine** 

#### **States** 

PLANNED READY LOADING RUNNING PAUSED COMPLETING COMPLETED FAILED CANCELLED 

#### **PLANNED → READY** 

Requires: 

- Machine assigned 

- Required configuration 

- Input available 

#### **READY → LOADING** 

Operator begins loading. 

#### **LOADING → RUNNING** 

Required input loading is complete. 

#### **RUNNING → PAUSED** 

Allowed if machine/process supports pause. 

#### **PAUSED → RUNNING** 

Operator resumes cycle. 

#### **RUNNING → COMPLETING** 

Machine cycle/process reaches completion. 

#### **COMPLETING → COMPLETED** 

Requires: 

- Input recorded 

- Output recorded 

- Operator 

- Machine 

- Start time 

- End time 

#### **RUNNING → FAILED** 

Machine/process failure. 

Required: 

- Failure reason 

- Exception if configured 

## **7.11 Drying Operation State Machine** 

Same base lifecycle: 

PLANNED 

↓ 

READY 

↓ 

IN_PROGRESS 

↓ 

COMPLETING 

↓ 

COMPLETED 

Failure: 

IN_PROGRESS → FAILED 

The exact process parameters are configuration-driven. 

## **7.12 Batch Transformation State Machine** 

Derived batches use: 

CREATED 

↓ 

AVAILABLE 

↓ 

PARTIALLY_CONSUMED 

↓ 

CONSUMED 

↓ 

CLOSED 

## **7.13 Package State Machine** 

#### **States** 

CREATED FILLING FILLED SEALED READY_FOR_CARTON IN_CARTON SHIPPED CANCELLED 

#### **Lifecycle** 

CREATED ↓ 

FILLING 

↓ FILLED 

↓ SEALED 

↓ 

READY_FOR_CARTON 

↓ 

IN_CARTON 

↓ 

SHIPPED 

#### **CREATED → FILLING** 

Package record created and packaging starts. 

#### **FILLING → FILLED** 

Required quantity/weight achieved. 

#### **FILLED → SEALED** 

Physical package is sealed. 

#### **SEALED → READY_FOR_CARTON** 

Package passes packaging validation. 

#### **→ READY_FOR_CARTON IN_CARTON** 

Package is scanned into a carton. 

Required: 

- Package valid 

- Package not already assigned 

- Carton valid 

#### **IN_CARTON → SHIPPED** 

Normally occurs indirectly when its parent carton is shipped. 

#### **Cancellation** 

A package can be cancelled only before irreversible downstream activity. 

## **7.14 Carton State Machine** 

This is one of the most important state machines in the system. 

#### **States** 

DRAFT PACKING READY_FOR_LABEL LABEL_PENDING PRINTING LABEL_PRINTED READY_TO_SHIP SHIPPED CANCELLED 

#### **Main Lifecycle** 

DRAFT ↓ 

PACKING 

↓ READY_FOR_LABEL 

↓ 

PRINTING 

↓ LABEL_PRINTED ↓ 

READY_TO_SHIP ↓ SHIPPED 

Failure path: 

PRINTING ↓ LABEL_PENDING ↓ PRINTING 

#### **DRAFT → PACKING** 

Triggered when first package is assigned. 

#### **PACKING → READY_FOR_LABEL** 

Requires: 

- Carton composition complete 

- Required package count/weight 

- All packages valid 

- No duplicate package 

- No package assigned elsewhere 

#### **READY_FOR_LABEL → PRINTING** 

Triggered by print request. 

#### **PRINTING → LABEL_PRINTED** 

Only after successful printer confirmation. 

#### **PRINTING → LABEL_PENDING** 

If printer fails, paper ends, communication fails or print cannot be confirmed. 

#### **LABEL_PENDING → PRINTING** 

Triggered by: 

- Reprint 

- Retry 

The same carton remains. 

No new carton is created. 

#### **→ LABEL_PRINTED READY_TO_SHIP** 

Requires successful label confirmation and carton completion. 

#### **READY_TO_SHIP → SHIPPED** 

Triggered by shipment completion. 

## **7.15 Label State Machine** 

#### **States** 

NOT_CREATED PENDING PRINTING PRINTED VOID REPLACED 

#### **Lifecycle** 

NOT_CREATED ↓ PENDING ↓ PRINTING ↓ PRINTED 

Failure: 

PRINTING → PENDING 

Replacement: 

PRINTED → REPLACED 

Void: 

PRINTED → VOID 

A label identifier is never silently reassigned. 

## **7.16 Label Print Attempt State Machine** 

Each physical print attempt has its own state. 

REQUESTED ↓ SENT_TO_PRINTER ↓ PRINTING ↓ SUCCESS 

Failure: 

REQUESTED ↓ FAILED 

or: 

PRINTING → FAILED 

This is separate from the Label state. 

Example: 

Label L001 │ ├── Attempt 1 → FAILED ├── Attempt 2 → FAILED └── Attempt 3 → SUCCESS 

## **7.17 Reprint State Machine** 

#### **States** 

REQUESTED AUTHORIZED PRINTING COMPLETED FAILED CANCELLED 

Lifecycle: 

REQUESTED 

↓ 

AUTHORIZED 

↓ 

PRINTING ↓ 

COMPLETED 

Failure: 

###### PRINTING → FAILED 

A reprint does not create a new carton. 

## **7.18 Pending Label Workflow** 

When multiple cartons have no label: 

CT-001 → LABEL_PENDING CT-002 → LABEL_PENDING CT-003 → LABEL_PENDING 

... 

CT-010 → LABEL_PENDING 

The operator must select a specific carton. 

The system displays: 

- Carton Serial 

- Time Created 

- Operator 

- Terminal 

- Package Count 

- Weight 

- Product 

- Grade 

- Status 

For higher security: 

Select Carton 

↓ Scan Package 

↓ 

System verifies ownership 

↓ 

Correct? 

┌────┴────┐ YES       NO ↓ ↓ 

Print     BLOCK 

This is the primary control against applying the wrong label to the wrong carton. 

## **7.19 Shipment State Machine** 

#### **States** 

DRAFT PREPARING READY LOADING SHIPPED CANCELLED CLOSED 

Lifecycle: 

DRAFT ↓ PREPARING ↓ READY ↓ LOADING ↓ SHIPPED ↓ CLOSED 

#### **DRAFT → PREPARING** 

Shipment created. 

Required: 

- Customer 

- Destination 

#### **PREPARING → READY** 

Required: 

- Required cartons assigned 

- All cartons eligible 

- Labels printed 

- No unresolved blocking exceptions 

#### **READY → LOADING** 

Physical shipment loading begins. 

#### **LOADING → SHIPPED** 

All required cartons confirmed loaded. 

#### **SHIPPED → CLOSED** 

Shipment finalized. 

## **7.20 Task State Machine** 

#### **States** 

CREATED ASSIGNED CLAIMED 

IN_PROGRESS PAUSED COMPLETED FAILED CANCELLED 

Lifecycle: 

CREATED ↓ ASSIGNED ↓ CLAIMED ↓ IN_PROGRESS ↓ COMPLETED 

Alternative: 

IN_PROGRESS → PAUSED → IN_PROGRESS IN_PROGRESS → FAILED 

#### **Task Assignment** 

Only eligible roles may claim a task. 

A task cannot be simultaneously owned by two operators unless explicitly configured as a multioperator task. 

## **7.21 Session State Machine** 

#### **States** 

CREATED ACTIVE IDLE 

EXPIRED CLOSED TERMINATED 

Lifecycle: 

CREATED ↓ ACTIVE ↓ IDLE ↓ ACTIVE ↓ CLOSED 

Timeout: 

ACTIVE → EXPIRED 

Administrative termination: 

ACTIVE → TERMINATED 

## **7.22 Exception State Machine** 

#### **States** 

OPEN ACKNOWLEDGED IN_PROGRESS RESOLVED REJECTED CLOSED 

Lifecycle: 

OPEN 

↓ 

ACKNOWLEDGED 

↓ 

IN_PROGRESS 

↓ 

RESOLVED ↓ CLOSED 

An exception cannot be marked RESOLVED without resolution information. 

## **7.23 Manager Override State Machine** 

#### **States** 

REQUESTED UNDER_REVIEW APPROVED REJECTED EXECUTED CANCELLED 

Lifecycle: 

REQUESTED 

↓ UNDER_REVIEW ↓ 

APPROVED 

↓ EXECUTED 

Alternative: 

UNDER_REVIEW → REJECTED 

Approval does not automatically mean the underlying transaction succeeded. 

The actual operation must still execute successfully. 

## **7.24 Inventory Adjustment State Machine** 

#### **States** 

DRAFT REQUESTED APPROVED POSTED REJECTED CANCELLED 

For small adjustments: 

REQUESTED → POSTED 

For large adjustments: 

REQUESTED ↓ APPROVED ↓ 

POSTED 

## **7.25 Configuration State Machine** 

#### **States** 

DRAFT ACTIVE INACTIVE ARCHIVED 

Lifecycle: 

DRAFT ↓ ACTIVE ↓ INACTIVE ↓ ARCHIVED 

A configuration version that has been used by transactions must not be deleted. 

## **7.26 Audit Event State** 

Audit records are not workflow entities. 

Their lifecycle is: 

CREATED ↓ IMMUTABLE 

Audit events cannot be edited or deleted through the normal application. 

## **7.27 State Transition Authorization Matrix** 

**Entity Operator Warehous Manager Admin e** Receiving ✓ ✓ ✓ ✓ Basket ✓ ✓ ✓ ✓ Sorting ✓ ✓ ✓ ✓ Washing ✓ ✓ ✓ ✓ Slicing ✓ ✓ ✓ ✓ 

Freezing ✓ ✓ ✓ ✓ Freeze Drying ✓ ✓ ✓ ✓ Packaging ✓ ✓ ✓ ✓ Carton ✓ ✓ ✓ ✓ Label Print ✓ ✓ ✓ ✓ Reprint ✓ ✓ ✓ ✓ Shipping Limited ✓ ✓ ✓ Inventory Adjustment ✕ Limited ✓ ✓ Manager Override ✕ ✕ ✓ ✓ Configuration ✕ ✕ ✓ ✓ Audit View View View Full 

The exact permission matrix remains configurable. 

## **7.28 Forbidden Transitions** 

The following are prohibited unless a specifically defined recovery/override process exists: 

SHIPPED → READY_TO_SHIP 

CLOSED → ACTIVE 

CONSUMED → AVAILABLE 

CANCELLED → ACTIVE 

COMPLETED → IN_PROGRESS 

LABEL_PRINTED → LABEL_PENDING 

Where a physical problem occurs after completion, the system uses: 

- Exception 

- Reprint 

- Reversal 

- Correction 

- Override 

rather than arbitrary state editing. 

## **7.29 State Transition Transaction** 

Every transition should execute atomically. 

Example: 

BEGIN TRANSACTION 

Validate Current State Validate User Validate Permission Validate Business Rules Validate Required Data 

Update Entity State 

Create State History 

Create Audit Event 

Create Inventory Movement if required 

COMMIT 

If any critical step fails: 

ROLLBACK 

No partial state transition should remain. 

## **7.30 Concurrency Protection** 

State transitions must use concurrency protection. 

Example: 

Terminal A: Carton CT-001 = READY_FOR_LABEL 

Terminal B: Carton CT-001 = READY_FOR_LABEL 

A → PRINTING 

B → PRINTING 

Only one request may successfully perform the transition. 

The second request must receive a controlled response such as: 

STATE_CHANGED 

and must refresh the current state. 

## **7.31 State History** 

Each stateful entity should maintain a state history. 

Example: 

Carton CT-001 

09:10 DRAFT 09:12 PACKING 09:18 READY_FOR_LABEL 09:19 PRINTING 09:19 LABEL_PENDING 09:23 PRINTING 09:23 LABEL_PRINTED 09:24 READY_TO_SHIP 

This provides an operational timeline without modifying the main entity record. 

## **7.32 State vs Event** 

State represents the current condition. 

Event represents something that happened. 

Example: State: LABEL_PRINTED Events: PRINT_REQUESTED PRINT_STARTED PRINT_FAILED REPRINT_REQUESTED PRINT_STARTED PRINT_SUCCEEDED 

The system must not attempt to replace event history with a single status field. 

## **7.33 State Machine and Inventory** 

Not every state transition changes inventory. 

Example: Carton: PACKING → READY_FOR_LABEL 

No inventory movement. 

But: 

Batch: AVAILABLE → PARTIALLY_CONSUMED 

may create an inventory movement. 

Inventory transactions must therefore be explicitly linked to the transitions that create them. 

## **7.34 State Machine and Traceability** 

A state transition must preserve genealogy. 

Example: 

Batch A 

↓ 

Sorting ↓ Batch B 

When Batch B becomes COMPLETED/AVAILABLE, the system must retain: 

Batch B Parent = Batch A Operation = Sorting #123 

## **7.35 State Machine and Exceptions** 

An exception may suspend normal progression. 

Example: 

RUNNING 

↓ 

FAILED 

↓ EXCEPTION OPEN 

↓ 

RESOLVED 

↓ 

RECOVERY ↓ RUNNING 

Recovery must use an explicitly defined transition. 

It must never simply change: 

FAILED → COMPLETED 

## **7.36 State Machine and Manager Override** 

An Override does not bypass the state machine. 

It authorizes a normally restricted transition. 

Example: 

COMPLETED ↓ REOPEN REQUESTED ↓ MANAGER APPROVAL ↓ REOPENED 

The transition remains auditable. 

## **7.37 State Machine and Configuration** 

State behavior must be configurable where business behavior genuinely varies. 

Examples: 

- Whether pause is allowed 

- Whether a mixed grade is allowed 

- Weight tolerance 

- Yield tolerance 

- Whether Manager Approval is required 

However, core integrity rules must not be configurable away. 

For example: 

Duplicate Package Assignment 

must remain prohibited. 

## **7.38 Core State Invariants** 

The following must always be true: 

###### **INV-STATE-001** 

An entity has exactly one current state. 

###### **INV-STATE-002** 

Current state must be one of its defined states. 

###### **INV-STATE-003** 

Every transition has a valid source state. 

###### **INV-STATE-004** 

Every transition has a valid target state. 

###### **INV-STATE-005** 

A transition is recorded in history. 

###### **INV-STATE-006** 

Unauthorized transitions are rejected. 

###### **INV-STATE-007** 

Completed historical transitions cannot be silently removed. 

## **7.39 Recommended Implementation Model** 

The database should store the current state on the entity: 

carton.status 

and maintain a separate history: 

carton_state_history 

Example: 

carton -------------------------------id serial status created_at updated_at 

carton_state_history 

-------------------------------- 

id carton_id from_status to_status transition user_id session_id terminal_id reason created_at 

This pattern should be applied to other major stateful entities. 

## **7.40 Final State Machine Architecture** 

The overall system lifecycle is: 

RECEIVING 

│ ▼ BATCH │ ▼ 

PROCESSING OPERATIONS 

│ ┌──────────┼──────────┐ ▼          ▼          ▼ SORTING     WASHING    SLICING │          │          │ └──────────┼──────────┘ ▼ 

FREEZING / DRYING │ ▼ BATCH │ ▼ PACKAGING │ ▼ PACKAGE │ ▼ CARTON │ ▼ LABEL PRINT │ ▼ READY TO SHIP │ ▼ SHIPMENT │ ▼ CUSTOMER 

Cross-cutting state systems: 

Session Task 

Exception Override Audit Configuration 

operate across the entire lifecycle. 

## **7.41 Final Design Rule** 

The system must distinguish between: 

WHAT STATE IS THE ENTITY IN? 

and: 

WHAT HAPPENED TO THE ENTITY? 

The first is represented by the current state. 

The second is represented by events, transactions, state history and audit records. 

This distinction is mandatory for reliable traceability, inventory integrity and operational recovery. 

# H. Scenarios 

## **08. SCENARIOS** 

**Real-World Operational Scenarios & Edge Cases — Final v1.0** 

## **8.1 Purpose** 

This section defines realistic operational scenarios and edge cases used to validate the system's: 

- Business Rules 

- State Machines 

- Inventory Integrity 

- Traceability 

- User Permissions 

- Sessions 

- Tasks 

- Label Management 

- Carton Identification 

- Exception Handling 

- Manager Override 

- Concurrency 

- Network Failure 

- Data Integrity 

Each scenario defines: 

1. Situation 

2. Actors 

3. Preconditions 

4. Actions 

5. Expected Result 

6. Business Rules 

7. State Changes 

8. Inventory Impact 

9. Traceability Impact 

10. Audit Requirements 

## **8.2 Scenario Classification** 

|**Category**|**Description**|
|---|---|
|NORMAL|Standard operation|
|EDGE|Unusual but valid condition|
|EXCEPTION|Operational problem|
|FAILURE|System/device/process<br>failure|
|SECURITY|Unauthorized action|
|CONCURRENCY|Multiple operators/devices|
|DATA|Data integrity problem|
|RECOVERY|Recovery from failure|
|OVERRIDE|Manager intervention|



## **8.3 Scenario ID Convention** 

SC-REC-*     Receiving SC-BAT-*     Batch SC-SRT-*     Sorting SC-WAS-*     Washing SC-SLC-*     Slicing SC-FRZ-*     Freezing SC-FD-*      Freeze Drying SC-DRY-*     Conventional Drying SC-PKG-*     Packaging SC-CTN-*     Carton SC-LBL-*     Label SC-RPR-*     Reprint SC-INV-*     Inventory SC-SHP-*     Shipping SC-TRC-*     Traceability SC-SES-*     Session SC-TSK-*     Task SC-EXC-*     Exception SC-OVR-*     Override SC-AUD-*     Audit SC-NET-*     Network SC-CON-*     Concurrency 

SC-CFG-*     Configuration SC-SITE-* Multi-Site 

## **8.4 Receiving Scenarios** 

#### **SC-REC-001 — Normal Receiving** 

###### **Situation** 

A supplier delivers fresh truffle. 

###### **Preconditions** 

- Supplier exists 

- Product exists 

- User has receiving permission 

- Active session 

###### **Action** 

Operator: 

1. Selects supplier 

2. Selects product 

3. Weighs material 

4. Creates receiving 

5. Confirms receipt 

###### **Expected Result** 

System creates: 

- Delivery 

- Receiving record 

- Receiving batch 

- Basket assignment if applicable 

- Inventory transaction 

- Audit record 

###### **State** 

DRAFT 

→ RECEIVING 

- → RECEIVED 

→ AVAILABLE 

## **8.5 SC-REC-002 — Weight Different From Expected** 

Expected: 100 kg Actual: 106 kg 

###### **Result** 

Receiving is allowed. System generates: 

WARNING 

if configured tolerance is exceeded. 

Original measured weight remains stored. 

## **8.6 SC-REC-003 — Invalid Negative Weight** 

Operator attempts: 

-5 kg 

###### **Result** 

BLOCK 

No inventory transaction is created. 

## **8.7 SC-REC-004 — Scale Disconnects During Receiving** 

###### **Action** 

Operator begins receiving. 

Scale disconnects before weight confirmation. 

###### **Result** 

- Transaction remains incomplete 

- No final inventory posting 

- User receives error 

- Session remains active 

- No false success 

## **8.8 SC-REC-005 — Receiving Cancelled** 

Operator starts receiving but supplier leaves before completion. 

###### **Result** 

Receiving may be cancelled if no irreversible transaction occurred. 

###### RECEIVING → CANCELLED 

Audit reason required. 

## **8.9 Basket Scenarios** 

**SC-BAT-001 — Basket Receives One Product** 

Basket B-001 receives fresh truffle. 

###### **Result** 

Basket B-001 Product = Fresh Truffle 

Basket becomes: 

FILLED 

## **8.10 SC-BAT-002 — Attempt to Put Different Product Into Basket** 

Basket contains: 

Fresh Truffle 

Operator attempts to add: 

Freeze-Dried Mango 

###### **Result** 

BLOCK 

## **8.11 SC-BAT-003 — Basket Used in Multiple Processing Sources** 

Basket contains material originating from multiple receiving deliveries. 

###### **Result** 

Allowed if process permits mixing. 

Traceability retains: 

Delivery A Delivery B Delivery C ↓ 

Basket B001 

## **8.12 Batch Scenarios** 

#### **SC-BAT-004 — Partial Batch Consumption** 

Batch: 

100 kg 

Operation consumes: 

40 kg 

###### **Result** 

AVAILABLE 

→ PARTIALLY_CONSUMED 

Remaining: 

60 kg 

## **8.13 SC-BAT-005 — Attempt to Consume More Than Available** 

Available: 

60 kg 

Operator requests: 

70 kg 

###### **Result** 

BLOCK 

Inventory remains unchanged. 

## **8.14 SC-BAT-006 — Split Batch** 

Input: 

100 kg 

Outputs: 

40 kg Grade A 35 kg Grade B 20 kg Industrial 

Loss: 

5 kg 

###### **Result** 

Valid because: 

40 + 35 + 20 + 5 = 100 kg 

Genealogy: 

Parent Batch ↓ Sorting ┌───┼────┐ A   B   Industrial 

## **8.15 SC-BAT-007 — Split Quantity Exceeds Input** 

Input: 

100 kg Output: 105 kg 

###### **Result** 

BLOCK 

unless an authorized adjustment/exception process applies. 

## **8.16 Sorting Scenarios** 

**SC-SRT-001 — Normal Sorting** 

Input: 200 kg 

Output: Grade A = 80 Grade B = 70 Grade C = 40 Loss = 10 

###### **Result** 

80 + 70 + 40 + 10 = 200 

Operation completes. 

## **8.17 SC-SRT-002 — Sorting Output Outside Tolerance** 

Input: 

200 kg 

Recorded output: 

195 kg 

Difference: 

5 kg 

###### **Result** 

Depends on configuration: 

WARNING 

or: 

OVERRIDE REQUIRED 

## **8.18 SC-SRT-003 — Invalid Grade** 

Operator attempts to assign: 

Grade X 

which does not exist. 

###### **Result** 

BLOCK 

## **8.19 Washing Scenarios** 

#### **SC-WAS-001 — Weight Increases After Washing** 

Input: 100 kg 

Output: 112 kg 

###### **Result** 

Allowed. 

If configured threshold is 8%: 

+12% WARNING 

Operation may continue. 

## **8.20 SC-WAS-002 — Washing Output Lower Than Expected** 

Input: 

100 kg 

Output: 

70 kg 

###### **Result** 

System calculates yield/loss. 

If outside tolerance: 

WARNING 

or: 

OVERRIDE 

depending on configuration. 

###### 8.20b SC-WAS-003 — Grade Downgrade During Washing 

Situation 

During washing, some truffles break or are damaged, causing part of the batch to fall below its original grade. 

Preconditions 

- Batch is Grade A, in an active washing operation Action 

Operator completes washing and reports the output as a mix of grades (e.g. Grade A remainder + Grade B + Industrial). 

Expected Result 

- System allows one input batch to produce multiple output batches at different grades via batch_genealogy, exactly as in Sorting — this is not limited to a Sorting operation. 

- No Waste record is created for the downgraded portion — it is a sellable output at a lower grade, not a loss. 

- Each output batch links back to the parent via batch_genealogy with relationship_type = GRADE_SPLIT. State 

Parent batch: AVAILABLE → CONSUMED (fully allocated to children) Child batches: (new) → AVAILABLE, each at its own grade 

## **8.21 Slicing Scenarios** 

**SC-SLC-001 — Normal Slicing** 

Input: 

50 kg 

Specification: 

2 mm 

Output: 

47 kg 

Loss: 

3 kg 

###### **Result** 

Operation completes if within tolerance. 

## **8.22 SC-SLC-002 — Wrong Slice Specification** 

Configured: 

2 mm 

Operator selects: 

5 mm 

###### **Result** 

BLOCK 

unless an authorized alternative specification is configured. 

8.22b SC-SLC-003 — Small/Broken Fragments Separated After Drying Situation 

Slicing leaves small and broken truffle fragments alongside the main sliced product; after drying, these fragments are separated and packaged as Industrial grade. Preconditions 

- Batch is in an active slicing operation Action 

   - Operator completes slicing; after the drying step, separates the small/broken fragments from the main output. 

   - Expected Result 

- Two child batches are created from the one slicing operation's output batch: the main product (original grade) and the fragments (Industrial grade), linked via batch_genealogy (relationship_type = GRADE_SPLIT). 

- This mirrors SC-WAS-003 — grade-splitting is a general capability of any processing operation, not exclusive to Sorting. State 

Slicing output batch: AVAILABLE → CONSUMED (split into two children) 

## **8.23 Freezing Scenarios** 

#### **SC-FRZ-001 — Normal Freezing** 

Input is eligible. 

Machine is available. 

Cycle starts. 

###### **Result** 

PLANNED 

- → READY → LOADING 

- → RUNNING 

→ COMPLETING → COMPLETED 

## **8.24 SC-FRZ-002 — Machine Failure** 

Machine fails during RUNNING. 

###### **Result** 

RUNNING → FAILED 

System creates exception if configured. 

No automatic completion. 

## **8.25 SC-FRZ-003 — Power Failure** 

Power is lost during cycle. 

###### **Result** 

System must not assume cycle completed. 

Cycle becomes: 

FAILED 

or: 

INTERRUPTED 

if that state is added in implementation. 

Operator must follow recovery procedure. 

## **8.26 Freeze-Drying Scenarios** 

#### **SC-FD-001 — Normal Freeze-Drying Cycle** 

Input: 

150 kg 

Output: 

15 kg 

###### **Result** 

Cycle completes. 

Yield: 

10% 

All input genealogy is retained. 

## **8.27 SC-FD-002 — Multiple Batches in One Cycle** 

Cycle receives: 

Batch A = 50 kg Batch B = 60 kg Batch C = 40 kg 

Total: 150 kg 

###### **Result** 

Allowed if machine/process configuration permits mixing. 

Cycle records all three parent batches. 

## **8.28 SC-FD-003 — Cycle Output Outside Expected Yield** 

Input: 

150 kg 

Output: 

30 kg Yield: 20% 

###### **Result** 

System generates warning/exception according to configured yield limits. 

Cycle may require Manager Override before completion. 

## **8.29 SC-FD-004 — Operator Forgets Output Weight** 

Operator attempts to complete cycle without output weight. 

###### **Result** 

BLOCK 

Cycle remains: 

COMPLETING 

or: 

RUNNING 

depending on implementation. 

## **8.30 Conventional Drying Scenarios** 

**SC-DRY-001 — Normal Drying** 

Input: 

100 kg 

Output: 

20 kg 

Operation completes. 

## **8.31 SC-DRY-002 — Excessive Yield** 

Input: 

100 kg 

Output: 

80 kg 

###### **Result** 

System does not automatically reject the operation. 

It calculates yield and creates warning/exception according to configuration. 

## **8.32 Packaging Scenarios** 

#### **SC-PKG-001 — Normal Package Creation** 

Operator: 

1. Selects batch 

2. Fills package 

3. Weighs package 

4. Seals package 

5. Confirms 

###### **Result** 

CREATED 

→ FILLING 

- → FILLED 

- → SEALED 

- → READY_FOR_CARTON 

Package receives unique serial. 

## **8.33 SC-PKG-002 — Duplicate Package Serial** 

System attempts to generate a serial already in use. 

###### **Result** 

BLOCK 

System generates a new unique serial. 

## **8.34 SC-PKG-003 — Package Underweight** 

Required: 

1000 g 

Actual: 970 g 

###### **Result** 

Depends on configured packaging tolerance: 

- Accept 

- ● Warning 

- Block 

## **8.35 Carton Scenarios** 

#### **SC-CTN-001 — Normal Carton Packing** 

Operator creates carton CT-001. 

Scans: 

PK-001 PK-002 PK-003 PK-004 

###### **Result** 

All packages are linked to CT-001. 

Carton: 

PACKING 

then: 

READY_FOR_LABEL 

## **8.36 SC-CTN-002 — Duplicate Package Scan** 

Operator scans: 

PK-001 PK-001 

###### **Result** 

First scan succeeds. 

Second scan: 

BLOCK 

Carton composition remains correct. 

## **8.37 SC-CTN-003 — Package Already Belongs to Another Carton** 

PK-001 belongs to CT-001. 

Operator attempts to add it to CT-002. 

###### **Result** 

BLOCK 

## **8.38 SC-CTN-004 — Mixed Grade Carton** 

Carton receives: 

Grade A Grade B 

###### **Result** 

If configured: ALLOW 

Otherwise: BLOCK 

## **8.39 SC-CTN-005 — Mixed Product Carton** 

Carton receives: 

Truffle Mango 

###### **Result** 

Normally: BLOCK 

unless explicitly configured as a mixed-product carton. 

## **8.40 Critical Label Scenario** 

**SC-LBL-001 — Printer Roll Runs Out** 

Ten cartons are ready: 

CT-001 CT-002 ... CT-010 

Printer successfully prints CT-001 through CT-006. 

Printer runs out of labels. 

###### **Result** 

CT-001 → LABEL_PRINTED 

... CT-006 → LABEL_PRINTED 

CT-007 → LABEL_PENDING ... 

CT-010 → LABEL_PENDING 

No cartons are duplicated. 

## **8.41 SC-LBL-002 — Operator Selects Wrong Carton** 

Operator physically has CT-008. 

But selects: 

CT-009 

from Pending Label Queue. 

System requires package verification. 

Operator scans: PK-00801 

System checks ownership: 

PK-00801 → CT-008 

but selected carton: 

CT-009 

###### **Result** 

BLOCK 

Label is not printed. 

This is the primary protection against incorrect carton labeling. 

## **8.42 SC-LBL-003 — Correct Carton Verification** 

Operator selects: 

CT-008 

Scans package: 

PK-00801 

System confirms: 

PK-00801 → CT-008 

###### **Result** 

Printing is allowed. 

LABEL_PENDING → PRINTING 

###### → LABEL_PRINTED 

## **8.43 SC-LBL-004 — Printer Communication Failure** 

Print command is sent. 

Printer does not respond. 

###### **Result** 

System must not assume success. 

Carton remains: 

LABEL_PENDING 

Print attempt: 

FAILED 

## **8.44 SC-LBL-005 — Printer Prints but Response Is Lost** 

This is a critical edge case. 

###### **Situation** 

Printer physically prints the label. 

Network response is lost. 

Server does not know whether printing succeeded. 

###### **Result** 

System must NOT automatically generate another carton or blindly print another label. 

Carton enters a controlled ambiguous state, for example: 

LABEL_PRINT_CONFIRMATION_REQUIRED 

or equivalent implementation state. 

Operator verifies physical label before retry. 

## **8.45 SC-LBL-006 — Label Damaged After Successful Print** 

Carton: 

LABEL_PRINTED 

Physical label is damaged. 

###### **Action** 

Operator requests reprint. 

###### **Result** 

Same carton serial. 

New print attempt. 

No new carton. 

## **8.46 SC-RPR-001 — Successful Reprint** 

CT-008: 

LABEL_PRINTED 

Operator requests reprint. 

###### **Result** 

Reprint Attempt #2 → SUCCESS 

Carton remains: 

LABEL_PRINTED 

## **8.47 SC-RPR-002 — Reprint of Wrong Carton** 

Operator selects CT-010 while physically holding CT-009. 

Package verification detects mismatch. 

###### **Result** 

BLOCK 

## **8.48 SC-RPR-003 — Multiple Failed Reprints** 

Attempt 1 → FAILED Attempt 2 → FAILED Attempt 3 → FAILED 

###### **Result** 

System records all attempts. 

After configurable threshold: 

EXCEPTION 

may be created. 

## **8.49 Inventory Scenarios** 

#### **SC-INV-001 — Normal Inventory Movement** 

Batch moves: 

Cold Storage → Processing Area 

###### **Result** 

Inventory movement created. 

## **8.50 SC-INV-002 — Negative Inventory Attempt** 

Available: 

20 kg 

Operator attempts movement: 

25 kg 

###### **Result** 

BLOCK 

## **8.51 SC-INV-003 — Manual Adjustment** 

Inventory shows: 

100 kg 

Physical count: 96 kg 

Operator requests: -4 kg 

###### **Result** 

If within tolerance: 

POSTED 

Otherwise: 

MANAGER OVERRIDE REQUIRED 

## **8.52 Shipping Scenarios** 

#### **SC-SHP-001 — Normal Shipment** 

Shipment includes: 

CT-001 CT-002 CT-003 

All cartons: READY_TO_SHIP 

All labels: PRINTED 

###### **Result** 

Shipment becomes: 

READY → LOADING → SHIPPED 

## **8.53 SC-SHP-002 — Carton Without Label** 

CT-003: LABEL_PENDING 

Operator attempts shipment. 

###### **Result** 

BLOCK 

## **8.54 SC-SHP-003 — Carton Already Shipped** 

CT-001 already belongs to completed shipment. 

Operator attempts to add it to another shipment. 

###### **Result** 

BLOCK 

## **8.55 Traceability Scenarios** 

#### **SC-TRC-001 — Forward Trace** 

User selects: 

Receiving Batch RB-001 

System displays: 

RB-001 ↓ Sorting Operation ↓ Batch B-101 ↓ Freeze Drying ↓ Batch B-201 ↓ Package PK-501 ↓ Carton CT-101 ↓ Shipment SH-010 ↓ Customer 

## **8.56 SC-TRC-002 — Backward Trace** 

User selects: 

Carton CT-101 

System displays all: 

- Packages 

- Source batches 

- Processing operations 

- Receiving batches 

- Suppliers 

## **8.57 SC-TRC-003 — Mixed Batch Traceability** 

Batch B-300 originates from: 

Batch A Batch B Batch C 

System must display all three parents. 

No parent may disappear because of merging. 

## **8.58 Session Scenarios** 

#### **SC-SES-001 — Normal Session** 

Operator logs in. 

Session: 

CREATED 

→ ACTIVE 

Operator performs work. 

Session closes: 

ACTIVE 

→ CLOSED 

## **8.59 SC-SES-002 — Session Timeout** 

Operator leaves terminal. 

Session expires. 

###### **Result** 

ACTIVE 

→ EXPIRED 

User must authenticate again before sensitive operations. 

## **8.60 SC-SES-003 — User Changes Role** 

Operator changes from: 

Packaging 

to: 

Warehouse 

###### **Result** 

New operational context must be established. 

Existing permissions must not silently carry over if role/session rules prohibit it. 

## **8.61 Task Scenarios** 

#### **SC-TSK-001 — Normal Task** 

Task: 

Pack Carton CT-100 

Flow: 

CREATED 

→ ASSIGNED 

→ CLAIMED 

→ IN_PROGRESS → COMPLETED 

## **8.62 SC-TSK-002 — Two Operators Claim Same Task** 

Operator A claims task. 

Operator B attempts claim. 

###### **Result** 

Only one succeeds unless multi-operator task is configured. 

## **8.63 SC-TSK-003 — Task Failure** 

Operator cannot complete task because machine is unavailable. 

###### **Result** 

Task: 

IN_PROGRESS 

→ FAILED 

Exception may be created. 

## **8.64 Exception Scenarios** 

#### **SC-EXC-001 — Weight Deviation** 

Actual weight exceeds configured threshold. 

###### **Result** 

Warning or Exception generated according to configuration. 

## **8.65 SC-EXC-002 — Operator Resolves Exception** 

Exception: 

OPEN 

Operator investigates. 

ACKNOWLEDGED 

→ IN_PROGRESS → RESOLVED 

Resolution reason required. 

## **8.66 SC-EXC-003 — Critical Exception** 

Example: 

Traceability inconsistency 

###### **Result** 

Affected operation may be blocked. 

Manager review required. 

## **8.67 Manager Override Scenarios** 

#### **SC-OVR-001 — Large Inventory Adjustment** 

Physical: 

95 kg 

System: 

100 kg 

Difference: 

-5 kg 

Configured tolerance: 

2 kg 

###### **Result** 

Manager approval required. 

REQUESTED 

- → UNDER_REVIEW 

- → APPROVED 

- → EXECUTED 

## **8.68 SC-OVR-002 — Manager Rejects Override** 

Manager determines adjustment is invalid. 

###### **Result** 

UNDER_REVIEW → REJECTED 

No inventory change. 

## **8.69 SC-OVR-003 — Manager Approves but Execution Fails** 

Manager approves adjustment. 

Database transaction fails. 

###### **Result** 

Override remains: APPROVED 

but not: EXECUTED 

System must not claim that the adjustment occurred. 

## **8.70 Concurrency Scenarios** 

#### **SC-CON-001 — Two Operators Scan Same Package** 

Package: 

PK-100 

Operator A scans into CT-001. 

Operator B simultaneously scans into CT-002. 

###### **Result** 

Exactly one transaction succeeds. 

Other receives: 

###### PACKAGE_ALREADY_ASSIGNED 

## **8.71 SC-CON-002 — Two Operators Consume Same Batch** 

Available: 

10 kg 

Operator A requests: 

7 kg 

Operator B requests: 

7 kg 

###### **Result** 

One transaction succeeds. 

Second must fail because: 

7 + 7 > 10 

No negative inventory. 

## **8.72 SC-CON-003 — Two Terminals Complete Same Carton** 

Terminal A and Terminal B both attempt: 

READY_FOR_LABEL 

###### → PRINTING 

###### **Result** 

Only one transition succeeds. 

Second terminal refreshes current state. 

## **8.73 Network Scenarios** 

#### **SC-NET-001 — Network Disconnect Before Save** 

Operator enters data. 

Network disconnects before submission. 

###### **Result** 

No server transaction exists. 

Client clearly indicates unsaved state. 

## **8.74 SC-NET-002 — Network Disconnect After Server Save** 

Server commits transaction. 

Response is lost. Client retries. 

###### **Result** 

Idempotency prevents duplicate transaction. 

## **8.75 SC-NET-003 — Network Disconnect During Label Printing** 

Server receives print request. 

Printer receives command. 

Network fails. 

###### **Result** 

System must not blindly create a second print transaction. 

Physical verification/reconciliation is required. 

8.75b Multi-Site Scenarios 

SC-SITE-001 — Internal Transfer Between Sites Situation 

A finished batch in Iran is shipped to the Dubai warehouse. Preconditions 

- Batch exists and is Available at the Iran site 

- Batch is packaged and ready for shipment 

- User has shipping permission at Iran site Action Iran operator: 

1. Creates shipment with dest_site_id = Dubai 2. Loads cartons into shipment 3. Completes shipment Dubai operator (on arrival): 

4. Scans incoming shipment 5. Confirms receipt Expected Result System creates at Iran site: 

- Shipment record (source_site_id = Iran, dest_site_id = Dubai) 

- Batch status changes to SHIPPED, no longer editable at Iran System creates at Dubai site: 

- New batch record (source_type = INTERNAL_TRANSFER, site_id = Dubai) 

- Reference to originating shipment 

- Inventory transaction at Dubai 

- Audit record at both sites State 

Iran batch: AVAILABLE → SHIPPED Dubai batch: (new) → RECEIVED → AVAILABLE 

SC-SITE-002 — Iran Site Loses International Connectivity Situation 

Iran's local server loses connection to the Cloud Aggregation service while production continues. 

Preconditions 

- Iran local application server and database are running normally 

- Cloud Aggregation service is unreachable Action 

   - Operators at Iran continue normal operations: receiving, sorting, washing, packaging, shipping. 

Expected Result 

- All operations complete normally against the local Iran database — no operation is blocked or degraded. 

- Every completed operation's event is queued in a local Outbox. 

- No data is lost. 

- Once connectivity returns, queued events transmit to Cloud Aggregation in original chronological order. 

- Cloud Aggregation reports show Iran data with a "last synced" timestamp until the queue is drained. 

State 

Outbox entries: PENDING → SENT (once connectivity restored) 

SC-SITE-003 — Quality Correction at a Site Other Than the Batch's Origin Situation 

A batch originating in Iran is now physically located in Dubai; Dubai's QC team finds the grade should be corrected. 

Preconditions 

- Batch is present (via internal transfer) at Dubai 

- User has QC permission at Dubai site Action Dubai QC operator corrects the grade on the batch. Expected Result 

- The grade correction event is recorded at the Dubai site's own database (site_id = Dubai), not at Iran. 

- The original batch record at Iran (which no longer holds this physical inventory) is not modified. 

- Traceability shows the correction occurred at Dubai, by whom, and when. State 

Batch grade: OldGrade → NewGrade (recorded at Dubai) 

## **8.76 Device Failure Scenarios** 

#### **SC-DEV-001 — Scanner Failure** 

Operator's Android scanner stops working. 

###### **Result** 

Operator can continue from another authorized terminal. 

No transaction history is lost. 

## **8.77 SC-DEV-002 — Label Printer Failure** 

Printer stops functioning. 

###### **Result** 

Cartons remain: 

LABEL_PENDING 

Operations can continue where business rules permit. 

Pending cartons appear in queue. 

## **8.78 SC-DEV-003 — Scale Failure** 

Scale unavailable. 

If weight is mandatory: 

BLOCK 

If manual entry is configured: 

WARNING / OVERRIDE 

depending on policy. 

## **8.79 Configuration Scenarios** 

#### **SC-CFG-001 — Add New Grade** 

Administrator adds: 

A+ 

###### **Result** 

New transactions may use A+. 

Historical transactions remain unchanged. 

## **8.80 SC-CFG-002 — Deactivate Grade** 

Grade A is deactivated. 

###### **Result** 

New transactions cannot select Grade A. 

Historical records remain valid. 

## **8.81 SC-CFG-003 — Change Yield Threshold** 

Current threshold: 

10% 

New threshold: 

8% 

###### **Result** 

New operations use 8%. 

Historical operations continue referencing the configuration/version applicable at their time. 

## **8.82 Configuration Race Condition** 

Two administrators modify the same configuration simultaneously. 

###### **Result** 

System must prevent silent overwrite. Possible mechanism: Version 12 ↓ Admin A edits Admin B edits A saves → Version 13 

B attempts save Version 12 ↓ CONFLICT 

Admin B must reload before saving. 

## **8.83 Audit Scenarios** 

#### **SC-AUD-001 — Normal Audit** 

Operator completes operation. 

Audit contains: 

User Timestamp Terminal Session Entity Action Previous State New State 

## **8.84 SC-AUD-002 — Failed Operation** 

Operator attempts invalid package assignment. 

###### **Result** 

The rejected attempt may be logged as a security/operational event according to audit configuration. 

At minimum, successful business state must remain unchanged. 

## **8.85 SC-AUD-003 — Manager Override Audit** 

Audit must show: 

Requested By Approved By Reason Original Value New Value Timestamp Entity 

## **8.86 Data Integrity Scenarios** 

#### **SC-DATA-001 — Orphan Package** 

A package exists without a valid source batch. 

###### **Result** 

Database constraints/business validation must prevent this. 

## **8.87 SC-DATA-002 — Orphan Carton Package Relation** 

Carton references package that does not exist. 

###### **Result** 

Database foreign key prevents record creation. 

## **8.88 SC-DATA-003 — Duplicate Serial** 

Two cartons attempt same serial. 

###### **Result** 

Database unique constraint rejects second record. 

## **8.89 SC-DATA-004 — Missing Genealogy** 

Derived batch created without parent reference. 

**Result** 

BLOCK 

## **8.90 Recovery Scenarios** 

#### **SC-RECOV-001 — Failed Operation Recovery** 

Operation fails. 

Manager/operator resolves cause. 

System creates recovery action. 

Original failure remains in history. 

Recovery operation creates new state/event records. 

## **8.91 SC-RECOV-002 — Failed FreezeDrying Cycle** 

Cycle fails halfway. 

System records: 

Cycle FD-100 Status = FAILED 

Input remains traceable. 

Recovery must not erase original cycle. 

**8.92 SC-RECOV-003 — Damaged Carton Label** 

Carton: 

READY_TO_SHIP 

Physical label damaged. 

###### **Result** 

Carton returns to a controlled label-replacement workflow. 

It does not become a new carton. 

## **8.93 Critical End-to-End Scenario** 

#### **SC-E2E-001 — Fresh Truffle to Export** 

###### **Step 1 — Receiving** 

Supplier delivers: 

100 kg Fresh Truffle 

System creates: 

Receiving Batch RB-001 

###### **Step 2 — Basket** 

Material enters: 

Basket B-001 

###### **Step 3 — Sorting** 

Outputs: 

A = 45 kg B = 35 kg 

Industrial = 15 kg Loss = 5 kg 

###### **Step 4 — Washing** 

Grade A: 

45 kg → 50 kg 

Warning generated if configured threshold exceeded. 

###### **Step 5 — Slicing** 

50 kg → 47 kg Loss = 3 kg 

###### **Step 6 — Freezing** 

Batch enters freezing cycle. 

Cycle completes. 

###### **Step 7 — Freeze Drying** 

Input: 

47 kg 

Output: 

4.7 kg 

###### **Step 8 — Packaging** 

Packages: 

PK-001 PK-002 PK-003 ... 

###### **Step 9 — Carton** 

Packages are scanned into: 

CT-001 

###### **Step 10 — Label** 

Printer successfully prints label. 

CT-001 LABEL_PRINTED 

###### **Step 11 — Shipping** 

CT-001 is added to shipment: 

SH-001 

###### **Step 12 — Customer** 

Shipment completed. 

Final traceability: 

Supplier ↓ 

RB-001 

↓ Sorting ↓ 

Grade A 

↓ 

Washing ↓ Slicing ↓ Freezing ↓ Freeze Drying ↓ Package ↓ Carton ↓ Shipment ↓ Customer 

## **8.94 Critical End-to-End Label Failure Scenario** 

#### **SC-E2E-002 — Ten Cartons Without Labels** 

Ten cartons are completed: 

CT-001 ... CT-010 

Printer prints: 

CT-001 ... CT-006 

Printer fails. 

Remaining: CT-007 ... CT-010 

are: 

LABEL_PENDING 

###### **Operator Returns With Physical CT-008** 

Operator opens Pending Label Queue. 

Selects: 

CT-008 

System displays: 

Carton: CT-008 Packages: PK-801 PK-802 PK-803 

Weight: 5.2 kg Created: 14:32 Operator: User-15 

Operator scans: PK-801 

System verifies: PK-801 → CT-008 

Printing allowed. 

###### **Wrong Physical Carton** 

If operator actually holds CT-009 and scans PK-901: 

PK-901 → CT-009 

but selected: 

CT-008 

Result: 

BLOCK 

This prevents the most dangerous operational failure in the label process. 

## **8.95 Critical Edge Case — Label Printed but Unknown Server Result** 

This scenario must be explicitly supported. 

Server ↓ Print Request ↓ Printer ↓ Physical Label Printed X Response Lost 

System does not know whether print succeeded. 

The system must not automatically perform another print. 

Recommended status: 

LABEL_PRINT_CONFIRMATION_REQUIRED 

Operator verifies the physical carton. 

Possible outcomes: 

Physical label exists ↓ Confirm ↓ LABEL_PRINTED 

or: 

Physical label absent ↓ Retry ↓ PRINTING 

## **8.96 Critical Edge Case — Same Package Scanned Twice Rapidly** 

Operator double-clicks scanner trigger. 

Input: 

PK-100 PK-100 

within milliseconds. 

###### **Result** 

Idempotency + duplicate validation ensure: 

Only one package assignment 

is created. 

## **8.97 Critical Edge Case — Browser/App Refresh During Transaction** 

Operator submits carton completion. 

Server completes transaction. 

Application crashes before receiving response. 

Operator reopens application. 

###### **Result** 

System queries server state. 

Carton shows: 

COMPLETED 

Operator must not create another carton. 

## **8.98 Critical Edge Case — Power Loss During Carton Packing** 

Operator has scanned: 

PK-001 PK-002 PK-003 

Power fails. 

###### **Result** 

After restart: 

CT-001 

must still contain: 

PK-001 PK-002 PK-003 

if those transactions were committed. 

Uncommitted scans must not appear. 

## **8.99 Critical Edge Case — Physical Package Missing** 

Digital system says: 

PK-100 → CT-001 

Physical package cannot be found. 

###### **Result** 

System does not remove package automatically. 

Exception created: 

PACKAGE_MISSING 

Manager investigation required according to severity. 

## **8.100 Critical Edge Case — Carton Physically Missing** 

Digital: 

CT-001 = READY_TO_SHIP 

Physical carton cannot be found. 

###### **Result** 

Shipment cannot proceed with CT-001. 

Exception is created. 

Carton remains historically traceable. 

## **8.101 Critical Edge Case — Carton Contains Unexpected Package** 

Physical carton CT-001 is opened. 

System says: 

PK-001 PK-002 PK-003 

Physical carton contains: 

PK-001 PK-002 PK-999 

###### **Result** 

Exception: 

CARTON_CONTENT_MISMATCH 

Shipment may be blocked. 

## **8.102 Critical Edge Case — Shipment Loading Mismatch** 

Shipment expects: 

CT-001 CT-002 CT-003 

Operator scans: 

CT-001 CT-002 CT-005 

###### **Result** 

CT-005 is rejected. CT-003 remains missing. 

Shipment cannot be completed. 

## **8.103 Critical Edge Case — Wrong Customer** 

Operator attempts to assign shipment to a customer that is not authorized/available according to configuration. 

###### **Result** 

BLOCK 

if customer restriction applies. 

## **8.104 Critical Edge Case — Historical Configuration** 

A package created under: 

Grade A 

Later Grade A is renamed or deactivated. 

###### **Result** 

Historical package remains associated with the original configuration/version. 

Historical data is not rewritten. 

## **8.105 Critical Edge Case — Product Deleted** 

Administrator attempts to delete a product with historical transactions. 

###### **Result** 

BLOCK 

Product becomes: 

INACTIVE 

instead. 

## **8.106 Critical Edge Case — User Loses Permission During Operation** 

Operator starts operation. 

Administrator removes operator's permission while operation is in progress. 

###### **Result** 

Behavior must be defined by security policy. 

Recommended: 

- Current transaction may finish if already authorized and atomic. 

- New transitions requiring removed permission are blocked. 

- Existing session permissions must be refreshed according to security policy. 

## **8.107 Critical Edge Case — Manager Approval Expires** 

Override requested. 

Manager does not approve within configured period. 

###### **Result** 

Override becomes: 

EXPIRED 

if expiry is enabled. 

Operation remains blocked. 

## **8.108 Critical Edge Case — Two Managers Approve** 

Same Override is submitted to two managers. 

###### **Result** 

Only the first valid approval should be accepted. 

Second approval is recorded as duplicate/late approval and must not execute the transaction twice. 

## **8.109 Critical Edge Case — Duplicate API Request** 

Client sends the same request twice: 

POST /cartons/CT-001/complete 

with same idempotency key. 

###### **Result** 

Only one business transaction is created. 

Second response references the existing transaction. 

## **8.110 Critical Edge Case — Duplicate Request With Different Data** 

Same idempotency key is reused with different payload. 

###### **Result** 

BLOCK 

because idempotency key reuse with different payload indicates an invalid request. 

## **8.111 Critical Edge Case — Database Failure During Transaction** 

Operation: 

Update Inventory Create Output Batch Create Audit 

Database fails after partial execution attempt. 

###### **Result** 

Database transaction must rollback. 

No partial business state may remain. 

## **8.112 Critical Edge Case — Audit Failure** 

Business transaction succeeds but audit insertion fails. 

For critical transactions: 

ROLLBACK 

is recommended. 

The system must not silently complete a transaction whose required audit event was not recorded. 

## **8.113 Critical Edge Case — Inventory and State Mismatch** 

Example: 

Carton = SHIPPED Inventory = still available 

This indicates an integrity failure. 

The system should detect/reconcile such inconsistencies. 

## **8.114 Critical Edge Case — Traceability Break** 

A package has: 

Package → Carton 

but no: 

Package → Source Batch 

This must be considered a critical data integrity violation. 

The package cannot be treated as normally traceable. 

## **8.115 Critical Edge Case — Mixing Without Permission** 

Operator tries to mix: 

Grade A 

+ 

Industrial 

when mixing is not configured. 

###### **Result** 

BLOCK 

## **8.116 Critical Edge Case — Process Waits for Another Batch** 

Freeze-drying cycle has only: 

100 kg 

available. 

Machine target: 150 kg 

Operator wants to wait for another delivery. 

###### **Result** 

System should support: 

PLANNED / READY 

without forcing an incomplete cycle. 

When additional material arrives, it can be added if the cycle is still in a compatible state. 

## **8.117 Critical Edge Case — Processing Cycle Uses Multiple Delivery Dates** 

Batch consists of material from: 

July 1 July 2 July 3 

###### **Result** 

Allowed where mixing is permitted. 

All three source references remain available. 

The system does not require one harvest date. 

## **8.118 Critical Edge Case — Partial Processing** 

Input: 

100 kg 

Only: 

60 kg 

is processed. 

###### **Result** 

Remaining: 40 kg 

remains available. 

The original batch is: 

PARTIALLY_CONSUMED 

## **8.119 Critical Edge Case — Processing Output Exceeds Input** 

Input: 

100 kg 

Output: 

110 kg 

###### **Result** 

System does not silently accept this. 

Depending on process type: 

- Warning 

- Exception 

- Manager Override 

- ● Block 

must be triggered according to configured rule. 

## **8.120 Critical Edge Case — Manual Weight Entry** 

Scale unavailable. 

Configuration permits manual entry. 

Operator enters: 

12.4 kg 

###### **Result** 

System records: 

Weight Source = MANUAL 

and: 

- User 

- Time 

- Reason 

- ● Terminal 

If manual entry requires Override, approval is enforced. 

## **8.121 Critical Edge Case — Scanner Reads Unknown Barcode** 

Operator scans: 

XYZ-999999 

No matching serial exists. 

###### **Result** 

BLOCK 

No transaction is created. 

## **8.122 Critical Edge Case — Barcode Belongs to Wrong Entity** 

Operator is packing a carton and scans a Basket barcode. 

###### **Result** 

System recognizes entity type mismatch. 

BLOCK 

Message should identify expected entity: 

Expected: Package Scanned: Basket 

## **8.123 Critical Edge Case — Barcode Already Retired** 

Operator scans a retired package/carton/serial. 

###### **Result** 

BLOCK 

System shows that the identifier is no longer active. 

## **8.124 Critical Edge Case — User Attempts Unauthorized Override** 

Operator tries to execute Manager Override endpoint. 

###### **Result:** 

403 / AUTHORIZATION ERROR 

No business change. 

Audit/security event may be recorded. 

## **8.125 Critical Edge Case — Closed Session Attempts Transaction** 

Session has: 

CLOSED 

Operator attempts inventory movement. 

**Result:** 

BLOCK 

New active session required. 

## **8.126 Critical Edge Case — Shipment Interrupted** 

Loading starts. 

Power/network fails. 

Some cartons have been physically loaded. 

###### **Result** 

Digital state must reflect only confirmed scans. 

Upon recovery: 

Expected vs Confirmed Loaded 

must be reconciled. 

## **8.127 Critical Edge Case — Shipment Contains More Cartons Than Planned** 

Shipment planned: 

10 cartons 

Operator scans: 11th carton 

###### **Result** 

Normally: BLOCK 

or: 

OVERRIDE 

depending on shipping policy. 

## **8.128 Critical Edge Case — Carton Label Exists but Serial Is Unreadable** 

Physical label damaged. 

Scanner cannot read it. 

###### **Recovery** 

Use: 

- Package verification 

- Manual carton lookup 

- Reprint workflow 

The system must not create a replacement carton. 

## **8.129 Critical Edge Case — Same Carton Has Two Physical Labels** 

Due to accidental duplicate printing, two identical labels may exist physically. 

###### **Result** 

System's digital carton remains one entity. 

Physical duplicate must be handled as an exception. 

One physical label should be invalidated/removed according to operational procedure. 

## **8.130 Critical Edge Case — Two Different Labels on Same Carton** 

Carton accidentally receives labels: 

CT-001 CT-002 

###### **Result** 

Critical exception. 

Shipment blocked until resolved. 

## **8.131 Critical Edge Case — Carton Label Printed for Wrong Carton** 

Label CT-001 physically attached to CT-002. 

Digital system cannot detect this solely from label existence. 

Detection mechanisms include: 

- Package verification 

- Carton verification 

- Shipment scan 

- Physical audit 

Once detected: 

LABEL_CARTON_MISMATCH 

exception. 

## **8.132 Critical Edge Case — Inventory Reconciliation** 

System: 

100 kg 

Physical: 98 kg 

###### **Result** 

Create reconciliation adjustment. 

No direct balance editing. 

## **8.133 Critical Edge Case — Historical Correction** 

An operator discovers an incorrect weight from yesterday. 

###### **Result** 

Historical record is not overwritten. 

System creates: 

Correction + Adjustment + Audit 

and retains original value. 

## **8.134 Critical Edge Case — Deleted User** 

User who performed historical operations is later deactivated. 

###### **Result** 

Historical records continue to show original user identity. 

User deactivation does not erase historical ownership. 

## **8.135 Critical Edge Case — Deleted Device** 

Terminal is retired. 

###### **Result** 

Historical transactions retain the original terminal identifier. 

Device is marked: 

RETIRED 

## **8.136 Critical Edge Case — Configuration Deleted After Use** 

A process configuration was used by 1,000 transactions. 

Administrator tries to delete it. 

###### **Result** 

Deletion blocked. 

Configuration becomes inactive/archived. 

## **8.137 Critical End-to-End Failure Matrix** 

**Failure System Response** 

Scale failure 

Block or controlled manual entry 

|Scanner failure|Switch terminal|
|---|---|
|Printer failure|Label Pending|
|Network failure|Pending/retry|
|Database failure|Rollback|
|Duplicate scan|Idempotent/Block|
|Wrong package|Block|
|Wrong carton|Verification + Block|
|Missing label|Reprint|
|Duplicate label|Exception|
|Missing package|Exception|
|Missing carton|Exception|
|Negative inventory|Block|
|Excessive<br>adjustment|Manager Override|
|Invalid grade|Block|
|Invalid state|Block|
|Failed machine cycle|Failed + Exception|
|Traceability break|Block/Exception|
|Unauthorized user|Block|
|Session expired|Re-authentication|



## **8.138 Acceptance Test Principle** 

Every critical Business Rule should map to at least one Scenario. 

Example: 

BR-CT-005 Package cannot belong to two cartons. 

↓ 

SC-CTN-003 

Package already belongs to another carton. 

↓ 

API Test 

↓ 

Database Constraint 

↓ 

Acceptance Test 

This creates traceability between requirements and implementation. 

## **8.139 Minimum Scenario Coverage** 

Before Version 1.0 production release, the following must have automated or documented tests: 

###### **Inventory** 

- Negative inventory 

- Partial consumption 

- Concurrent consumption 

- Adjustment 

- Large adjustment 

###### **Packaging** 

- Duplicate package 

- Wrong package 

- Package already assigned 

- Package cancellation 

###### **Carton** 

- Normal carton 

- Mixed grade 

- Mixed product 

- Duplicate package 

- Wrong package 

- Carton completion 

###### **Labels** 

- Normal print 

- Printer failure 

- Roll empty 

- Reprint 

- Wrong carton 

- Wrong package 

- Print response lost 

- Duplicate physical label 

###### **Shipping** 

- Normal shipment 

- Missing label 

- Wrong carton 

- Duplicate carton 

- Shipment interruption 

###### **Traceability** 

- Forward trace 

- Backward trace 

- Split 

- Merge 

- Mixed batches 

- Missing genealogy 

###### **Security** 

- Unauthorized operation 

- Unauthorized Override 

- Expired session 

- Deactivated user 

###### **Reliability** 

- Network loss 

- Database failure 

- Device failure 

- Duplicate API request 

- Concurrent request 

## **8.140 Final Scenario Architecture** 

The system should be validated through five layers: 

BUSINESS RULE 

↓ STATE MACHINE ↓ SCENARIO ↓ API TEST ↓ ACCEPTANCE TEST 

For critical operations: 

Scenario ↓ Database Integrity ↓ API Validation ↓ UI Validation ↓ Audit Verification ↓ Traceability Verification 

## **8.141 Final Principle** 

A scenario is not successful merely because the UI displays the expected message. 

A scenario is successful only when all relevant layers remain correct: 

UI 

↓ 

API 

↓ Business Logic 

↓ 

Database 

↓ 

Inventory ↓ State 

↓ 

Traceability 

↓ 

Audit 

The system is considered operationally correct only when the physical-world event and the digital-world record remain consistent or any inconsistency is explicitly detected and controlled. 

# I.IMPLEMENTATION SPECIFICATION 

## **09. IMPLEMENTATION SPECIFICATION** 

#### **Version 1.0 — Backend, Database & System Implementation Standard** 

## **9.1 Purpose** 

This document converts the approved business model, ER Diagram, Database Schema, Business Rules, State Machines, Scenarios, and API Specification into concrete implementation requirements. 

The purpose is to eliminate ambiguity between: 

- Business requirements 

- Database implementation 

- Backend services 

- API behavior 

- State transitions 

- Inventory transactions 

- Traceability 

- Sessions 

- Tasks 

- Exceptions 

- Manager overrides 

- Audit 

- Configuration 

This document is the implementation contract for Version 1. 

## **9.2 Implementation Principle** 

The application must be implemented as a: 

###### **Transaction-driven operational system with immutable business history, controlled state transitions, traceable physical entities, and current-state projections.** 

The system must not treat the database as a passive data store. 

Every important physical operation must produce a controlled business transaction. 

## **9.3 Recommended Technology Baseline** 

Version 1 should use: 

Backend: Node.js + TypeScript 

API: REST API 

Database: PostgreSQL 

Authentication: Token-based authentication 

Frontend: Web application 

Mobile: Android industrial scanner application 

Stationary Terminal: Raspberry Pi / browser-based terminal 

Cache / Temporary State: Redis — optional 

File Storage: Object storage — only if required 

Deployment: Linux server + Docker 

The technology stack may be changed by the development team only if the replacement preserves all functional and transactional requirements defined in this document. 

## **9.4 Database Standard** 

The relational database must be PostgreSQL or an equivalent ACID-compliant relational database. 

The database must support: 

- Foreign keys 

- Transactions 

- Row-level locking 

- Unique constraints 

- Check constraints 

- JSON/JSONB 

- Timestamp with timezone 

- Indexes 

- Transaction isolation 

- Reliable rollback 

No business-critical data may be stored exclusively in application memory. 

## **9.5 Database Naming Convention** 

Use snake_case. 

Examples: 

batch_id operation_id created_at updated_at current_location_id 

Table names must be plural: 

batches operations users sessions tasks 

Primary keys: 

id 

Foreign keys: <entity>_id 

## **9.6 Primary Key Standard** 

All core entities must use UUID primary keys. 

Example: 

id UUID PRIMARY KEY 

Business-readable identifiers must be separate. 

Example: 

id = UUID batch_number = B-2026-000145 

The business number must never replace the database primary key. 

## **9.7 Business Identifier Standard** 

The following entities require human-readable unique identifiers: 

Batch Operation Package Carton Shipment Session Task Exception Manager Override Label 

Example: 

Batch: B-2026-000145 

Operation: OP-2026-000893 

Carton: CT-2026-001242 

Identifier generation must be centralized. 

Two terminals must never generate the same identifier. 

## **9.8 Timestamp Standard** 

All timestamps must be stored in UTC. 

Use: 

TIMESTAMPTZ 

Application interfaces may display local time. 

Example: Database: 2026-08-08T13:20:00Z 

UI: 17:50 

The server must not rely on the device's local clock for business-critical timestamps. 

## **9.9 Current State vs Historical State** 

The system has two categories of data. 

###### **Historical** 

operations inventory_movements batch_genealogy audit_logs label_print_attempts manager_overrides 

These represent what happened. 

###### **Current State** 

inventory_balances batch.status package.status carton.status shipment.status session.status task.status 

Current state may be updated. 

Historical events must not be rewritten to represent the new state. 

## **9.10 Transaction Boundary** 

Every business operation that changes multiple related records must execute inside one database transaction. 

Example: 

Complete Receiving ↓ BEGIN TRANSACTION 

Create Batch Create Operation 

Create Operation Output Create Inventory Movement Update Inventory Balance Create Audit Log 

COMMIT 

If any step fails: 

ROLLBACK 

No partial receiving operation may remain. 

## **9.11 Example: Receiving Transaction** 

BEGIN 

1. Validate supplier 

2. Validate product 

3. Validate grade 

4. Validate quantity 

5. Create receiving operation 

6. Create batch 

7. Create operation output 

8. Create inventory movement 

9. Update inventory balance 

10. Create audit log 

11. Complete operation 

COMMIT 

Failure at step 7 means steps 1–6 must be rolled back. 

## **9.12 Inventory Transaction Standard** 

Inventory must never be changed directly by UI code. 

Incorrect: inventory_balance.quantity += 10 

Correct: 

Business Command ↓ Inventory Service ↓ Inventory Movement ↓ Balance Projection 

All inventory changes must have a business reason. 

## **9.13 Inventory Movement Requirements** 

Every movement requires: 

batch_id quantity unit_id movement_type timestamp user_id session_id 

Where applicable: 

from_location_id to_location_id operation_id 

## **9.14 Inventory Validation** 

The system must reject: 

quantity <= 0 

unless the movement type explicitly supports a negative adjustment. 

The system must reject consumption greater than available inventory. 

Example: 

Available = 20 kg 

Request: 25 kg 

Result: REJECTED 

No partial automatic consumption should occur unless explicitly requested by the business operation. 

## **9.15 Inventory Concurrency** 

Inventory consumption must be protected against concurrent requests. 

Example: 

Available: 10 kg 

Operator A requests: 7 kg Operator B requests: 7 kg 

Only one request may consume the remaining inventory. 

Recommended approach: 

BEGIN 

SELECT inventory_balance FOR UPDATE 

Validate available quantity 

Create movement Update balance 

COMMIT 

## **9.16 Idempotency** 

All APIs that create business transactions must support idempotency. 

Examples: 

POST /receiving POST /operations/{id}/complete POST /cartons/{id}/complete POST /labels/{id}/print POST /labels/{id}/reprint POST /shipments/{id}/load POST /overrides/{id}/execute 

The request must contain: 

Idempotency-Key 

Duplicate requests using the same key must not create duplicate business transactions. 

## **9.17 Idempotency Behavior** 

First request: 

Idempotency-Key: ABC-123 

Result: 

201 Created 

Repeated request: 

Idempotency-Key: ABC-123 

Result: same logical response 

It must NOT create: 

second batch second inventory movement second label second shipment loading 

## **9.18 State Transition Architecture** 

The application must not allow arbitrary updates such as: 

UPDATE cartons SET status = 'SHIPPED' 

from any controller. 

Instead: 

CartonService.ship(cartonId) 

must validate the transition. 

Example: 

READY_TO_SHIP ↓ LOADING ↓ SHIPPED 

Invalid: 

CREATED ↓ SHIPPED 

must be rejected. 

## **9.19 State Machine Implementation** 

Each state machine should be implemented as a controlled transition function. Example: 

transition(entity, currentState, requestedTransition) 

The transition must validate: 

1. Current state 

2. User permission 

3. Required data 

4. Business rules 

5. Related entity state 

6. Required approvals 

Only then should the database state change. 

## **9.20 Batch Implementation** 

A batch must have: 

product grade size quantity unit status 

location source 

Batch quantity must not be silently overwritten. 

If quantity changes because of processing: 

Parent Batch ↓ Operation ↓ Child Batch 

The genealogy must be recorded. 

## **9.21 Batch Splitting** 

Example: 

100 kg Batch 

Sorting 

45 kg → Grade A 35 kg → Grade B 15 kg → Industrial 5 kg → Loss 

The implementation must create: 

B-001 parent 

B-002 B-003 B-004 

and genealogy records. 

## **9.22 Batch Merging** 

Multiple batches may become one processing input. 

Example: 

B-001 = 40 kg B-002 = 35 kg 

Processing 

B-003 = 75 kg 

The system must preserve: 

B-001 → B-003 B-002 → B-003 

The parent batches must remain traceable. 

## **9.23 Processing Operation Implementation** 

Each processing operation must contain: 

operation_type inputs outputs user session device location start_time completion_time status 

Examples: 

SORTING WASHING SLICING FREEZING FREEZE_DRYING CONVENTIONAL_DRYING PACKAGING 

## **9.24 Processing Yield** 

Where applicable: 

Input Quantity 

- 

Output Quantity = 

Process Difference 

The difference may represent: 

- Loss 

- Waste 

- Moisture change 

- Residual material 

- Measurement variance 

The system must not automatically classify the difference as loss unless the operation definition requires it. 

## **9.25 Processing Cycle Implementation** 

Machine-dependent operations may have a processing cycle. 

Example: 

Freeze Drying Operation 

↓ 

Processing Cycle 

↓ 

Machine ↓ Start ↓ Run ↓ Complete 

Machine parameters should be stored in a structured JSON field where the parameters are process-specific. 

## **9.26 Basket Implementation** 

A basket has a unique physical identity. 

Basket Serial ↓ Basket ↓ Current Batch ↓ Current Location 

A basket may change its contents over time, but the system must preserve operational history. 

A basket is not itself a batch. 

## **9.27 Package Implementation** 

Each traceable package must have a unique serial number. 

A package must reference: 

batch_id product_id quantity unit 

package_type status 

A package cannot be created without a valid source batch unless the operation type explicitly allows it. 

## **9.28 Carton Implementation** 

A carton represents a physical shipping container. 

A carton may contain multiple packages. 

Example: 

Carton CT-001 

Package P-001 Truffle A 

Package P-002 Truffle B 

Package P-003 Freeze-dried Mango 

This is valid if the business rules permit the combination. 

## **9.29 Carton Completion** 

A carton becomes: 

READY_TO_SHIP 

only after required packaging information is complete. 

Required checks may include: 

At least one package 

All packages valid No package already assigned elsewhere Required weight available Required product data available 

## **9.30 Label Implementation** 

Label generation must be deterministic. 

The label must be generated from the carton state and its approved contents. 

The system must store: 

label_serial carton_id label_type status 

The actual printable content may be generated dynamically from these records. 

## **9.31 Reprint Implementation** 

Reprint must NOT create: 

new carton new package new shipment 

It creates a new: 

label_print_attempt 

Example: 

Label L-001 

Attempt 1 → FAILED 

Attempt 2 → SUCCESS Attempt 3 → SUCCESS 

All attempts remain available for audit. 

## **9.32 Printer Failure** 

If printing fails: 

Label: PRINTING ↓ 

FAILED 

The carton remains identifiable. 

The user must be able to request: 

REPRINT 

without rebuilding the carton. 

## **9.33 Session Implementation** 

A session represents an authenticated operational work context. 

Session contains: 

user device role start last_activity status 

Every operational transaction should reference the session where applicable. 

## **9.34 Session Expiration** 

An expired session must not perform new business transactions. 

Example: 

ACTIVE 

↓ inactivity EXPIRED 

The operator must authenticate again. 

Already committed transactions remain valid. 

## **9.35 Device Independence** 

The system must not permanently bind an operation to a physical device. 

Example: 

Scanner A fails 

Operator logs into 

Scanner B 

Same role Same permissions Continue operation 

The device is metadata about execution, not the identity of the business process. 

## **9.36 Task Implementation** 

Tasks represent work that needs to be performed. 

Example: 

Manager prioritizes basket ↓ Task created ↓ Operator accepts ↓ Operator performs ↓ Task completed 

Task completion must be linked to the resulting business operation where applicable. 

## **9.37 Exception Implementation** 

Exceptions must not silently block every operation. 

The system should distinguish: 

WARNING ERROR CRITICAL 

A warning may permit continuation. 

An error may require resolution. 

A critical exception may require manager intervention. 

## **9.38 Manager Override** 

Manager override must be a controlled workflow. 

Operator ↓ 

Override Request 

↓ Manager Review ↓ Approve / Reject ↓ Execution ↓ Audit 

An override must contain: 

reason requester approver previous value requested value timestamps 

## **9.39 Configuration Implementation** 

Configuration must not be hardcoded into business logic when it is intended to be operationally configurable. 

Examples: 

Grades Sizes Packaging types Tolerance thresholds Process parameters Label templates 

Configuration changes must be versioned. 

## **9.40 Configuration Activation** 

A new configuration version must have: 

DRAFT 

↓ APPROVED ↓ 

ACTIVE 

A future-dated configuration may be scheduled. 

Historical operations continue to reference the configuration applicable at execution time. 

## **9.41 Configuration Validation** 

Configuration changes must validate: 

- Duplicate keys 

- Invalid values 

- Invalid references 

- Conflicting ranges 

- Unsupported product combinations 

Example: 

Size: 10–18g 

New Size: 15–20g 

The system should detect overlap if overlapping size ranges are not permitted. 

## **9.42 API Service Layer** 

Controllers must remain thin. 

Recommended architecture: 

HTTP Request 

- ↓ 

Controller ↓ Validation ↓ Application Service ↓ Domain / Business Rules ↓ Repository ↓ Database 

Do not place business rules directly inside HTTP controllers. 

## **9.43 Repository Layer** 

Repositories should be responsible for persistence. 

Examples: 

BatchRepository OperationRepository InventoryRepository PackageRepository CartonRepository ShipmentRepository SessionRepository TaskRepository ExceptionRepository ConfigurationRepository 

Repositories must not decide business transitions. 

## **9.44 Service Layer** 

Services implement business actions. 

Examples: 

ReceivingService InventoryService SortingService WashingService ProcessingService PackagingService CartonService LabelService ShipmentService TraceabilityService SessionService TaskService ExceptionService OverrideService ConfigurationService 

## **9.45 Validation Layers** 

Validation should exist at three levels. 

###### **API Validation** 

Checks: 

required fields format types basic ranges 

###### **Business Validation** 

Checks: 

state permissions inventory relationships business rules 

###### **Database Validation** 

Checks: 

FK UNIQUE NOT NULL CHECK 

No single layer should be trusted to enforce everything. 

## **9.46 Error Response Standard** 

API errors must use a consistent structure. 

Example: 

{ "error": { "code": "INVALID_STATE_TRANSITION", "message": "Carton cannot be shipped from its current state.", "entity": "carton", "entity_id": "..." } } 

## **9.47 Error Codes** 

Core error codes should include: 

INVALID_REQUEST UNAUTHORIZED FORBIDDEN NOT_FOUND INVALID_STATE_TRANSITION INSUFFICIENT_INVENTORY DUPLICATE_SERIAL DUPLICATE_OPERATION DUPLICATE_REQUEST 

INVALID_CONFIGURATION OVERRIDE_REQUIRED SESSION_EXPIRED DEVICE_NOT_AVAILABLE PRINT_FAILED CONCURRENT_UPDATE 

## **9.48 HTTP Status Codes** 

Recommended mapping: 

200 OK 201 Created 204 No Content 

400 Bad Request 401 Unauthorized 403 Forbidden 404 Not Found 409 Conflict 422 Unprocessable Entity 

500 Internal Server Error 

Business conflicts should normally return: 

409 Conflict 

rather than generic 500 errors. 

## **9.49 Logging** 

Application logs must include: 

timestamp request_id user_id 

session_id device_id endpoint operation result error_code duration 

Never log: 

- passwords 

- authentication tokens 

- sensitive credentials 

## **9.50 Request Correlation** 

Every API request must receive: 

request_id 

Example: 

REQ-8F31A21 

This ID must appear in: 

API logs application logs error logs audit context 

where applicable. 

## **9.51 Audit Implementation** 

Audit logging must occur inside the same transaction as the business event whenever practical. 

Example: 

Complete Carton 

BEGIN 

Update carton state Create audit record 

COMMIT 

If the transaction fails, the audit event describing the successful change must not remain. 

## **9.52 Security** 

The system must implement: 

Authentication Authorization Role-based permissions Session expiration Secure password storage HTTPS Input validation Audit logging 

Passwords must never be stored in plaintext. 

## **9.53 Authorization Model** 

Authorization must be checked at the service/business-action level. 

Do not rely only on UI hiding. 

Example: 

Even if the UI does not show: 

Override 

the API must still reject an unauthorized override request. 

## **9.54 Data Access Rules** 

Operators should only access operational data required for their role. 

Managers may access: 

exceptions overrides operational reports 

Administrators may manage: 

users roles configuration devices 

## **9.55 Backup** 

Production database backups must be automated. 

Minimum requirement: 

Daily full backup + Point-in-time recovery capability where infrastructure permits 

Backups must be stored separately from the primary database server. 

## **9.56 Recovery** 

The system must define: 

RPO RTO 

Recommended initial targets: 

RPO: ≤ 24 hours RTO: ≤ 4 hours 

These may be tightened for production deployment. 

## **9.57 Database Indexing** 

Indexes are required on: 

batches.batch_number batches.product_id batches.status 

operations.operation_number operations.operation_type operations.status 

inventory_movements.batch_id inventory_movements.created_at 

inventory_balances.batch_id inventory_balances.location_id 

packages.serial_number packages.batch_id 

cartons.carton_number cartons.status 

labels.label_serial labels.carton_id 

shipments.shipment_number 

shipments.status 

tasks.status tasks.assigned_user_id 

exceptions.status exceptions.entity_id 

audit_logs.entity_type audit_logs.entity_id audit_logs.created_at 

Indexes must be reviewed using actual query performance after implementation. 

## **9.58 Database Migration** 

Schema changes must use version-controlled migrations. 

Never modify production schema manually without a migration. 

Example: 

001_initial_schema 002_add_configuration 003_add_label_attempts 004_add_indexes 

Migration scripts must be stored in source control. 

## **9.59 Seed Data** 

Version 1 must provide seed data for: 

System roles Default permissions Units Basic operation types Basic statuses 

Initial configuration groups 

Production-specific business data must not be hardcoded into the source code. 

## **9.60 Testing Strategy** 

Testing must include four levels. 

###### **Unit Tests** 

Business logic. 

###### **Integration Tests** 

API + Database. 

###### **Workflow Tests** 

End-to-end business processes. 

###### **Concurrency Tests** 

Multiple terminals performing the same operation. 

## **9.61 Mandatory Test Scenarios** 

At minimum: 

Receiving Receiving duplicate request Receiving invalid product Sorting Batch split Batch merge Washing Slicing Freezing Freeze drying Packaging 

Carton creation Duplicate package scan Label printing Printer failure Label reprint Shipment loading Duplicate shipment loading Inventory conflict Session expiration Manager override Configuration update Traceability backward Traceability forward 

## **9.62 Concurrency Tests** 

The system must explicitly test: 

Two operators scan same basket Two operators consume same batch Two terminals complete same carton Two terminals print same label Two users approve same override Two users modify same configuration 

Expected result: 

Exactly one valid transaction where the business rule permits only one. 

## **9.63 Offline Consideration** 

Version 1 should NOT attempt to implement full offline inventory synchronization unless explicitly required. 

Android scanners may cache: 

UI state last-loaded tasks temporary scan data 

but inventory-changing transactions should require server confirmation unless an explicit offline transaction architecture is introduced. 

This prevents inventory divergence. 

## **9.64 Scan Processing** 

A scanner event should follow: 

SCAN 

↓ 

Decode 

↓ 

Identify Entity ↓ 

Validate Session 

↓ 

Validate Entity State 

↓ 

Validate Business Rule 

↓ 

Execute Transaction 

↓ 

Return Result ↓ 

Refresh UI 

A successful scan must not automatically imply a successful business transaction. 

## **9.65 Duplicate Scan Handling** 

If the same barcode is scanned twice: 

First scan: SUCCESS 

Second scan: DUPLICATE_SCAN 

unless the operation explicitly supports repeated scans. 

The system must provide a clear user-facing result. 

## **9.66 Weight Capture** 

Weight data must be associated with: 

entity operation device user session timestamp 

Where the scale is available. 

The system should preserve the captured weight used for the transaction rather than relying on a later recalculated value. 

## **9.67 Measurement Integrity** 

For weight-sensitive operations: 

Captured Weight 

↓ 

Validated Weight 

↓ 

Business Transaction 

The operator must not silently edit a captured weight. 

If correction is required: 

Adjustment + Reason + Audit 

must be used. 

## **9.68 API Transaction Rule** 

An API endpoint that represents one business action should generally map to one atomic business transaction. 

Bad design: 

POST /update-carton-status POST /update-inventory POST /create-audit 

for one physical action. 

Preferred: 

POST /cartons/{id}/complete 

which internally performs all required operations atomically. 

## **9.69 No Direct Database Access from Clients** 

The following clients must never connect directly to PostgreSQL: 

Web browser Android scanner Raspberry Pi terminal 

They communicate through the backend API. 

Client ↓ API ↓ Application Services ↓ Database 

## **9.70 API Versioning** 

API routes should be versioned. 

Example: 

/api/v1/receiving /api/v1/batches /api/v1/operations /api/v1/inventory /api/v1/cartons /api/v1/labels /api/v1/shipments 

Breaking changes require a new API version. 

## **9.71 Deployment Environments** 

At minimum: 

Development Staging Production 

Production data must never be used casually in development. 

## **9.72 Configuration by Environment** 

Environment-specific configuration must be externalized. 

Examples: 

DATABASE_URL API_BASE_URL JWT_SECRET STORAGE_URL PRINTER_SERVICE_URL REDIS_URL 

Secrets must not be committed to source control. 

## **9.73 Production Monitoring** 

Monitor at minimum: 

API availability API latency Database connections Database errors Failed transactions Inventory conflicts Label failures Authentication failures Unhandled exceptions 

## **9.74 Health Checks** 

The backend should expose: 

GET /health GET /health/db 

The system should report whether: 

Application Database Required dependencies 

are available. 

## **9.75 Implementation Priority** 

Development order should be: 

1. Database 

2. Authentication / Users / Roles 

3. Core Master Data 

4. Batches & Genealogy 

5. Inventory 

6. Operations 

7. Sessions 

8. Tasks 

9. Packaging 

10. Cartons 

11. Labels / Reprint 

12. Shipping 13. Exceptions 14. Overrides 15. Configuration 16. Audit 17. Reporting 

## **9.76 Minimum Viable Backend** 

Before UI development is considered complete, the backend must support: 

Create batch Receive batch Move inventory Create operation Consume batch Create output batch 

Track genealogy Create package Create carton Print label Reprint label Create shipment Load carton Trace backward Trace forward Create exception Request override Approve override Audit action 

## **9.77 Definition of Done — Database** 

Database implementation is complete when: 

- All approved tables exist 

- PK/FK constraints are active 

- Required indexes exist 

- Unique constraints exist 

- Migrations are version controlled 

- Transactions are implemented 

- Inventory integrity is protected 

- Batch genealogy works 

- Audit works 

- Configuration versioning works 

- Backup works 

- Restore has been tested 

## **9.78 Definition of Done — Backend** 

Backend implementation is complete when: 

- API specification is implemented 

- State machines are enforced 

- Business rules are enforced server-side 

- Inventory transactions are atomic 

- Idempotency is implemented 

- Concurrency is handled 

- Authentication works 

- Authorization works 

- Errors are standardized 

- Audit is generated 

- Core scenarios pass 

- API integration tests pass 

## **9.79 Definition of Done — Operational System** 

The system is ready for pilot operation when an operator can complete the following without database intervention: 

Receive 

↓ 

Store 

↓ 

Sort 

↓ 

Wash 

↓ 

Slice 

↓ 

Freeze 

↓ 

Freeze Dry / Dry 

↓ 

Package 

↓ 

Cartonize 

↓ 

Print Label 

↓ 

Reprint if necessary 

↓ 

Prepare Shipment ↓ 

Ship 

↓ 

Trace Entire History 

## **9.80 Final Implementation Rule** 

The development team must not implement business behavior by improvisation. 

If a requirement is unclear: 

Business Rule ↓ State Machine ↓ Scenario ↓ ER Model ↓ API Specification ↓ Implementation 

The implementation must follow this hierarchy. 

If two documents conflict, the conflict must be resolved before coding rather than silently choosing one interpretation. 

## **9.81 Final Version 1 Boundary** 

Version 1 must optimize for: 

Operational reliability Traceability Inventory accuracy Simple scanning Fast execution Auditability Controlled configuration Low training requirements 

It must NOT optimize for: 

Maximum feature count Advanced analytics AI automation Complex forecasting ERP functionality Accounting CRM Full IoT integration 

## **9.82 Final Implementation Architecture** 

┌─────────────────────┐ │      WEB UI         │ └──────────┬──────────┘ │ ┌──────────▼──────────┐ │   ANDROID SCANNER   │ └──────────┬──────────┘ │ ┌──────────▼──────────┐ │ RASPBERRY PI / POS  │ └──────────┬──────────┘ │ ▼ ┌─────────────────────┐ │      REST API       │ └──────────┬──────────┘ │ ┌──────────▼──────────┐ │ APPLICATION SERVICES│ ├─────────────────────┤ │ Receiving           │ │ Inventory           │ │ Processing          │ │ Packaging           │ │ Label               │ │ Shipping            │ │ Traceability        │ │ Session             │ │ Task                │ 

│ Exception           │ │ Override            │ │ Configuration       │ └──────────┬──────────┘ │ ┌──────────▼──────────┐ │   DOMAIN / RULES    │ │ State Machines      │ │ Business Rules      │ │ Validation          │ └──────────┬──────────┘ │ ┌──────────▼──────────┐ │    REPOSITORIES     │ └──────────┬──────────┘ │ ┌──────────▼──────────┐ │     PostgreSQL      │ ├─────────────────────┤ │ Master Data         │ │ Batches             │ │ Genealogy           │ │ Operations          │ │ Inventory           │ │ Packages            │ │ Cartons             │ │ Labels              │ │ Shipping            │ │ Sessions            │ │ Tasks               │ │ Exceptions          │ │ Overrides           │ │ Audit               │ │ Configuration       │ └─────────────────────┘ 

## **9.83 Final Statement** 

This document establishes the implementation boundary for Version 1. 

The development team should be able to take: 

01 System Overview 02 Business Workflow 03 ER Diagram & Database Schema 04 Business Rules 05 UI / Wireframes 06 API Specification 07 State Machines 08 Scenarios 09 Implementation Specification 

and proceed to implementation without inventing core business behavior. 

Any requirement discovered after this point must be classified as one of: 

Clarification Bug Missing implementation detail New requirement Scope change 

A genuine new requirement must not be silently inserted into Version 1. 

It must be explicitly evaluated for: 

Business impact Database impact API impact UI impact State-machine impact Traceability impact Testing impact 

before implementation. 

# J. SECURITY / PERMISSIONS 

## **10. SECURITY & PERMISSIONS SPECIFICATION** 

#### **Version 1.0** 

## **10.1 Purpose** 

This document defines the security architecture, authentication model, authorization model, role permissions, operational restrictions, approval requirements, and audit requirements for Version 1 of the system. 

The objective is to ensure that: 

- Users can only perform actions authorized for their role. 

- Operators cannot bypass business rules through the API. 

- Sensitive actions require appropriate authorization. 

- Manager overrides are controlled. 

- Configuration changes are restricted. 

- Inventory cannot be manipulated outside approved workflows. 

- All security-sensitive actions are auditable. 

## **10.2 Security Principles** 

The system follows these principles: 

###### **1. Least Privilege** 

Users receive only the permissions required to perform their assigned work. 

###### **2. Server-Side Authorization** 

Permissions must be enforced by the backend. 

Hiding a button in the UI is NOT security. 

###### **3. Separation of Duties** 

The same user should not automatically be able to: 

Request Override ↓ Approve Own Override 

###### **4. Traceability** 

Security-sensitive actions must identify: 

User Session Device Timestamp Action Entity Result 

###### **5. No Direct Database Access** 

Users and terminals must never connect directly to PostgreSQL. 

###### **6. Explicit Privilege Escalation** 

Sensitive actions require explicit permissions or manager approval. 

## **10.3 Security Layers** 

The system has five security layers: 

Authentication ↓ Session Security ↓ Role Authorization ↓ Business Permission ↓ Audit 

## **10.4 Authentication** 

Every human user must authenticate before performing protected operations. 

Authentication may use: 

- Username + password 

- PIN for approved operational terminals 

- QR/badge authentication 

- Future biometric authentication 

Version 1 should use username/password and/or secure PIN/badge authentication as required by the deployment environment. 

## **10.5 Password Requirements** 

Passwords must: 

- Never be stored in plaintext. 

- Be hashed using a modern password hashing algorithm. 

- Never appear in logs. 

- Never be returned through API responses. 

Recommended: 

Argon2id 

Alternative: 

bcrypt 

## **10.6 Account Status** 

A user account must have a status. 

ACTIVE INACTIVE LOCKED SUSPENDED 

Only ACTIVE users may authenticate. 

## **10.7 Failed Login Protection** 

The system must track failed authentication attempts. 

Example policy: 

5 failed attempts ↓ Temporary lock ↓ Manager/Admin unlock 

The exact threshold may be configurable. 

The system must not reveal whether a username exists during authentication failure. 

## **10.8 Session Security** 

Every successful authentication creates a session. 

Session contains: 

session_id user_id device_id role_context created_at last_activity_at expires_at status 

Possible states: 

ACTIVE EXPIRED REVOKED 

LOGGED_OUT 

## **10.9 Session Expiration** 

A session must expire after configurable inactivity. 

Recommended initial value: 

30 minutes 

For high-risk administrative operations, a shorter re-authentication window may be required. 

## **10.10 Session Revocation** 

A manager/admin must be able to revoke an active session. 

Example: 

User loses scanner ↓ Manager opens Sessions ↓ Revoke Session ↓ 

Scanner can no longer perform operations 

## **10.11 Device Security** 

Each operational device must have a registered device identity. 

Example: 

DEV-ANDROID-001 DEV-RPI-003 DEV-WEB-005 

Device status: 

ACTIVE DISABLED MAINTENANCE LOST 

A disabled device cannot execute protected transactions. 

## **10.12 Device Is Not a Permission** 

A device must never grant permissions by itself. 

Incorrect: 

Raspberry Pi = Manager Access 

Correct: 

Device + Authenticated User + Role + Permission = 

Authorized Action 

## **10.13 Role Model** 

Version 1 should use the following logical roles: 

ADMIN 

MANAGER RECEIVING_OPERATOR STORAGE_OPERATOR SORTING_OPERATOR WASHING_OPERATOR SLICING_OPERATOR FREEZING_OPERATOR DRYING_OPERATOR PACKAGING_OPERATOR SHIPPING_OPERATOR QUALITY_OPERATOR 

A user may have more than one operational role if required. 

## **10.14 Administrative Role** 

ADMIN is responsible for system-level administration. 

Allowed: 

- Manage users 

- Manage roles 

- Manage permissions 

- Manage devices 

- Manage configuration 

- View audit logs 

- Manage system settings 

- Disable users 

- Disable devices 

Admin should NOT automatically approve business overrides unless explicitly assigned that permission. 

## **10.15 Manager Role** 

MANAGER is responsible for operational supervision. 

Allowed: 

- View operational dashboard 

- View inventory 

- Review exceptions 

- Approve permitted overrides 

- Prioritize tasks 

- Reassign tasks 

- Review traceability 

- Review operational history 

- Approve operational adjustments 

- Review label failures 

- Review audit records 

Manager should not automatically have unrestricted system configuration access. 

## **10.16 Operational Roles** 

Operational users perform specific physical workflows. 

Examples: 

Receiving Operator Storage Operator Sorting Operator Washing Operator Slicing Operator Freezing Operator Drying Operator Packaging Operator Shipping Operator 

Their permissions should be action-based rather than page-based. 

## **10.17 Permission Structure** 

Permissions should follow: 

<domain>.<action> 

Examples: 

inventory.view inventory.move 

receiving.create receiving.complete 

sorting.create sorting.complete 

packaging.create packaging.complete 

carton.create carton.complete 

label.print label.reprint 

shipment.create shipment.load shipment.complete 

traceability.view 

exception.create exception.resolve 

override.request override.approve 

configuration.view configuration.create configuration.approve configuration.activate 

audit.view 

## **10.18 Permission Categories** 

Permissions are divided into: 

###### **Read** 

*.view 

###### **Create** 

*.create 

###### **Execute** 

*.execute *.complete 

###### **Modify** 

*.update 

###### **Cancel** 

*.cancel 

###### **Approve** 

*.approve 

###### **Administrative** 

*.manage 

## **10.19 Core Permission List** 

#### **Authentication** 

auth.login auth.logout auth.change_password 

#### **Users** 

users.view users.create users.update users.disable users.reset_password 

#### **Roles** 

roles.view roles.manage permissions.manage 

#### **Devices** 

devices.view devices.register devices.update devices.disable devices.reactivate 

## **10.20 Receiving Permissions** 

receiving.view receiving.create receiving.update receiving.complete receiving.cancel 

Receiving operators should normally have: 

receiving.view receiving.create receiving.complete 

but not: 

receiving.cancel 

unless explicitly granted. 

## **10.21 Inventory Permissions** 

inventory.view inventory.move inventory.adjust inventory.consume inventory.release inventory.count inventory.adjust.approve 

Critical rule: 

inventory.adjust must not automatically imply inventory.adjust.approve. 

## **10.22 Processing Permissions** 

For each processing domain: 

processing.view processing.create processing.start processing.complete processing.cancel 

Examples: 

sorting.create sorting.complete 

washing.create washing.complete 

slicing.create slicing.complete 

freezing.create freezing.complete 

drying.create drying.complete 

## **10.23 Packaging Permissions** 

packaging.view packaging.create packaging.complete packaging.cancel 

package.view package.create package.update 

carton.view carton.create carton.complete carton.cancel 

## **10.24 Label Permissions** 

label.view label.print label.reprint label.cancel label.manage_template 

Operational users may normally have: 

label.print label.reprint 

but not: 

label.manage_template 

## **10.25 Shipping Permissions** 

shipment.view shipment.create shipment.update shipment.load shipment.unload shipment.complete shipment.cancel 

shipment.cancel should require elevated authorization. 

## **10.26 Traceability Permissions** 

traceability.view traceability.export 

Traceability access may be broader than modification access. 

A user may be allowed to see history without being allowed to change it. 

## **10.27 Exception Permissions** 

exception.view exception.create exception.update exception.resolve exception.close 

Operators may create exceptions. 

Managers may resolve or close them. 

## **10.28 Override Permissions** 

override.view override.request override.approve override.reject override.execute 

Critical rule: 

A user must not approve their own override request. 

## **10.29 Configuration Permissions** 

configuration.view configuration.create configuration.update configuration.submit configuration.approve configuration.activate configuration.deactivate configuration.rollback 

Recommended separation: 

Operator: view 

Manager: view create update submit 

Admin: approve activate deactivate 

rollback 

Actual assignment may be adjusted according to business governance. 

## **10.30 Audit Permissions** 

audit.view audit.export 

Audit records must be read-only. 

No normal user may: 

audit.update audit.delete 

These permissions should not exist. 

## **10.31 Permission Matrix** 

|**Domain / Action**|**Operator**|**Manager**|**Admin**|
|---|---|---|---|
|View own tasks|✅|✅|✅|
|Create operational task<br>result|✅|✅|✅|
|Receive product|Role-based|✅|✅|
|Move inventory|Role-based|✅|✅|
|Inventory adjustment|✅|Request/<br>Approve|✅|
|Process product|Role-based|✅|✅|
|Create package|Role-based|✅|✅|
|Complete carton|Role-based|✅|✅|



|Print label|Role-based|✅|✅|
|---|---|---|---|
|Reprint label|Role-based|✅|✅|
|Create shipment|Shipping role|✅|✅|
|Load shipment|Shipping role|✅|✅|
|View traceability|Limited|✅|✅|
|Create exception|✅|✅|✅|
|Resolve exception|✅|✅|✅|
|Request override|✅|✅|✅|
|Approve override|✅|✅|Explicit|
|Manage configuration|✅|Limited|✅|
|Activate configuration|✅|✅/Limited|✅|
|Manage users|✅|✅|✅|
|Manage roles|✅|✅|✅|
|Manage devices|✅|Limited|✅|
|View audit|Limited|✅|✅|
|Export audit|✅|Limited|✅|



|**10.32**|**Rol**|**e-Ba**|**sed**|**Ope**|**rati**|**onal**|**Matrix**||
|---|---|---|---|---|---|---|---|---|
|**Operati**|**Receivi**|**Stora**|**Sorti**|**Washi**|**Slici**|**Freezi**|**Dryin**<br>**Packagi**|**Shippi**|
|**on**|**ng**|**ge**|**ng**|**ng**|**ng**|**ng**|**g**<br>**ng**|**ng**|
|Receive|✅|✅|✅|✅|✅|✅|✅<br>✅|✅|
|Store|✅|✅|✅|✅|✅|✅|✅<br>✅|✅|
|Sort|✅|✅|✅|✅|✅|✅|✅<br>✅|✅|
|Wash|✅|✅|✅|✅|✅|✅|✅<br>✅|✅|



Slice ✅ ✅ ✅ ✅ ✅ ✅ ✅ ✅ ✅ Freeze ✅ ✅ ✅ ✅ ✅ ✅ ✅ ✅ ✅ Dry ✅ ✅ ✅ ✅ ✅ ✅ ✅ ✅ ✅ Package ✅ ✅ ✅ ✅ ✅ ✅ ✅ ✅ ✅ Ship ✅ ✅ ✅ ✅ ✅ ✅ ✅ ✅ ✅ 

## **10.33 Scope-Based Access** 

Permissions should be supplemented by operational scope. 

Example: 

A user may have: 

inventory.move 

but only for: 

Cold Storage A 

Another user may have the same permission for: 

Dry Warehouse 

Therefore authorization may depend on: 

Permission 

+ Location + Operation Type + Entity State 

## **10.34 Entity-Level Security** 

The backend must verify that the requested entity is within the user's operational scope. 

Example: 

Operator assigned to Cold Storage A 

Request: Move Basket B-001 

Basket location: Cold Storage B 

Result: 

FORBIDDEN 

unless the user has cross-location permission. 

## **10.35 State-Based Authorization** 

Permission alone is insufficient. 

Example: 

User has shipment.load 

but shipment is: 

CANCELLED 

The operation must still be rejected. 

Authorization requires: 

Permission 

+ Valid State + 

Business Rules 

## **10.36 Manager Approval Matrix** 

Certain actions require manager approval. 

|**Action**|**Operator**|**Manager Approval**|
|---|---|---|
|Normal inventory move|✅|✅|
|Normal receiving|✅|✅|
|Normal sorting|✅|✅|
|Normal packaging|✅|✅|
|Normal label reprint|✅|✅|
|Inventory adjustment|Request|✅|
|State override|Request|✅|
|Incorrect scan correction|Request|✅|
|Manual weight correction|Request|✅|
|Closed operation modification|Request|✅|
|Configuration activation|✅|Admin/Authorized Manager|
|Shipment cancellation|Request|✅|
|Historical data correction|Request|Explicit approval|



## **10.37 High-Risk Actions** 

The following actions are classified as high-risk: 

Inventory adjustment Historical correction 

State override Manual weight correction Shipment cancellation Configuration activation Configuration rollback User permission escalation 

High-risk actions must always generate an audit event. 

## **10.38 Re-Authentication for High-Risk Actions** 

For critical actions, the system may require the manager to re-authenticate. 

Example: 

Manager clicks Approve 

↓ 

System requests PIN/password 

↓ 

Authentication successful 

↓ 

Override approved 

This protects against approval using an unattended manager session. 

## **10.39 Permission Escalation** 

A user cannot grant themselves additional permissions. 

Example: 

Operator ↓ Modify own role 

must always be rejected. 

Role changes require: 

Admin 

or another explicitly authorized administrator. 

## **10.40 Temporary Permission** 

Version 1 should avoid arbitrary temporary permission grants. 

If temporary access is required, it should be represented by: 

Temporary Role Assignment 

with: 

user_id role_id granted_by start_at expires_at reason 

## **10.41 Audit Requirements** 

The following must be audited: 

Login Logout 

Failed login Password change Role assignment Permission change Device registration Device disabling Inventory adjustment Override request Override approval Override rejection Configuration change Configuration activation Configuration rollback Historical correction Shipment cancellation Label reprint Manual weight correction 

## **10.42 Audit Record** 

Audit record should contain: 

audit_id timestamp user_id session_id device_id action entity_type entity_id previous_state new_state reason request_id ip_address result 

Sensitive credentials must never be stored in audit records. 

## **10.43 Immutable Audit** 

Audit records are append-only. 

Normal application users must not be able to: 

UPDATE audit_logs DELETE audit_logs 

If an audit entry is incorrect, a correcting audit event must be created. 

## **10.44 Security Events** 

Security events should be separately identifiable. 

Examples: 

LOGIN_SUCCESS LOGIN_FAILED ACCOUNT_LOCKED SESSION_REVOKED PERMISSION_DENIED ROLE_CHANGED DEVICE_DISABLED 

## **10.45 Permission Denied Behavior** 

When a user attempts an unauthorized action: 

API: 

403 Forbidden 

Example: 

{ "error": { "code": "FORBIDDEN", 

"message": "You do not have permission to approve this override." } } 

The system must also generate an appropriate security audit event. 

## **10.46 No Permission Leakage** 

Error responses must not reveal sensitive information. 

Bad: 

User X is not authorized because role Y lacks permission Z. 

Preferred: 

You do not have permission to perform this action. 

Detailed authorization information belongs in server logs/audit. 

## **10.47 API Security** 

All protected endpoints must validate: 

Authentication Session User status Device status Permission Entity scope Business state 

## **10.48 API Example** 

Request: 

POST /api/v1/inventory/adjustments 

Backend flow: 

Authenticate ↓ Validate Session ↓ Check inventory.adjust ↓ Check location scope ↓ Check adjustment reason ↓ Check manager approval requirement ↓ Create adjustment request ↓ Audit 

The frontend cannot bypass the approval requirement. 

## **10.49 Security Around Scanners** 

An Android scanner must: 

- Have a registered device ID. 

- Require authentication. 

- Have a valid session. 

- Communicate over HTTPS. 

- Not store permanent credentials in plaintext. 

- Not contain database credentials. 

- Not contain admin privileges. 

If the device is reported lost: 

DEVICE → LOST 

all active sessions associated with that device should be revocable. 

## **10.50 Security Around Raspberry Pi** 

The Raspberry Pi terminal must not have database credentials exposed to the local operator. Recommended: 

Browser / Terminal App 

↓ Authenticated API ↓ Backend ↓ Database 

The Pi should not be able to query PostgreSQL directly. 

## **10.51 Printer Security** 

Printing should be controlled through the backend or a controlled printer service. 

A user should not be able to manipulate label data by directly sending arbitrary database content to the printer. 

## **10.52 Export Security** 

Exports containing operational or traceability data must require appropriate permissions. 

Examples: 

traceability.export audit.export inventory.export 

Export events should be audited. 

## **10.53 Sensitive Data** 

The system should minimize storage of sensitive personal data. 

Required user information should generally be limited to: 

name username role contact information where required account status 

Personal information not required for system operation should not be collected. 

## **10.54 Security of Configuration** 

Configuration may affect: 

- Inventory classification 

- Product grading 

- Processing 

- Packaging 

- Label generation 

- ● Shipping 

Therefore configuration changes are controlled changes, not ordinary CRUD operations. 

## **10.55 Configuration Approval Flow** 

User ↓ Create Configuration ↓ DRAFT 

↓ Submit ↓ REVIEW ↓ Approve ↓ APPROVED ↓ Activate ↓ ACTIVE 

Rejected: REVIEW ↓ REJECTED 

## **10.56 Security of Historical Data** 

Historical operational records must not be edited directly. 

If correction is necessary: 

Original Record ↓ Correction Request ↓ Approval ↓ Correction Transaction ↓ Audit 

The original event remains preserved. 

**10.57 Security Classification of Data Data Classification Access** 

Product master Operational Broad Inventory Operational Role-based Batch history Operational Role-based Traceability Operational Manager+ Audit Sensitive Manager/Admin operational User accounts Sensitive Admin Permissions Highly sensitive Admin Configuration Sensitive Authorized operational Overrides Sensitive Manager/Admin Authentication data Highly sensitive System only 

## **10.58 Security Acceptance Criteria** 

Security implementation is accepted only when: 

- Unauthorized API requests are rejected. 

- UI restrictions cannot bypass backend permissions. 

- Users cannot approve their own overrides. 

- Operators cannot modify historical records. 

- Inventory adjustments are controlled. 

- Configuration activation is restricted. 

- Disabled devices cannot perform operations. 

- Expired sessions cannot perform transactions. 

- Audit records cannot be modified by normal users. 

- Failed authentication is protected against brute force. 

- High-risk actions are audited. 

- Role changes are audited. 

- Permission changes are audited. 

## **10.59 Final Authorization Model** 

The final authorization decision should conceptually follow: 

REQUEST │ ▼ AUTHENTICATED? /          \ NO            YES │              │ DENY             ▼ VALID SESSION? /         \ NO           YES │             │ DENY            ▼ DEVICE ACTIVE? /       \ NO         YES │           │ DENY          ▼ PERMISSION? /    \ NO      YES │        │ DENY       ▼ ENTITY IN SCOPE? /      \ NO        YES │          │ DENY         ▼ VALID STATE? /    \ NO      YES │        │ DENY       ▼ BUSINESS RULES │ ▼ EXECUTE │ ▼ AUDIT 

## **10.60 Final Security Rule** 

The most important implementation rule is: 

###### **Permission does not authorize an action by itself.** 

An action is authorized only when all required conditions are satisfied: 

Authenticated User + Active Session + Active Device + Required Permission + Correct Operational Scope + Valid Entity State + Business Rules + Required Approval = AUTHORIZED ACTION 

This model must be enforced by the backend and must never depend solely on UI behavior. 

# K. CONCURRENCY / TRANSACTIONS 

## **11. CONCURRENCY & TRANSACTION SPECIFICATION** 

#### **Version 1.0** 

## **11.1 Purpose** 

This document defines how the system handles simultaneous users, devices, scans, inventory operations, state transitions, duplicate requests, retries, and database transactions. 

The objective is to guarantee: 

- Inventory integrity 

- Exactly-once business effects where required 

- Safe concurrent operations 

- No duplicate physical transactions 

- No invalid state transitions caused by race conditions 

- Safe retry behavior 

- Consistent audit history 

- Atomic business operations 

## **11.2 Core Principle** 

The system must assume that multiple devices may attempt to modify the same entity at the same time. 

The backend must therefore be designed under the assumption: 

###### **Any request can arrive concurrently with any other request.** 

The application must never rely on the UI to prevent concurrent actions. 

## **11.3 Concurrency Sources** 

Potential concurrent requests include: 

Android Scanner A │ Android Scanner B │ Raspberry Pi Terminal │ Web Browser │ Manager Dashboard │ Background Service │ ▼ API Server 

Examples: 

- Two operators scan the same basket. 

- Two operators consume the same batch. 

- Two users complete the same operation. 

- Two users assign the same package to cartons. 

- Two users load the same carton into shipments. 

- Two users approve the same override. 

- Two users modify the same configuration. 

- A device retries a request after a network timeout. 

All of these must be handled safely. 

## **11.4 ACID Requirement** 

All business-critical database transactions must satisfy: 

###### **Atomicity** 

Either the complete business action succeeds or none of it is committed. 

###### **Consistency** 

Database constraints and business rules remain valid. 

###### **Isolation** 

Concurrent transactions cannot create invalid business states. 

###### **Durability** 

Committed transactions survive application or server failure. 

## **11.5 Business Transaction Definition** 

A business transaction represents one logically indivisible business action. 

Example: 

Complete Receiving 

is one business transaction even if it changes multiple tables. 

It may update: 

receiving operations batches inventory_movements inventory_balances audit_logs 

These changes must be committed together. 

## **11.6 Transaction Boundary** 

The transaction boundary must be defined around the business action, not around individual database statements. 

Incorrect: 

INSERT operation COMMIT 

INSERT batch COMMIT 

INSERT inventory COMMIT 

Correct: 

BEGIN 

INSERT operation INSERT batch INSERT inventory movement UPDATE inventory balance INSERT audit 

COMMIT 

## **11.7 Rollback Rule** 

If any required step fails: 

BEGIN ↓ Operation ↓ Batch ↓ Inventory ↓ Audit ↓ ERROR ↓ ROLLBACK 

The system must leave no partial business transaction. 

## **11.8 Transaction Isolation** 

The default PostgreSQL isolation level should normally be: 

READ COMMITTED 

Higher isolation should be used selectively when required. 

Do not use SERIALIZABLE globally unless performance testing demonstrates that it is appropriate. 

## **11.9 Row-Level Locking** 

For inventory and state-sensitive operations, use row-level locks where necessary. 

Example: 

SELECT * FROM inventory_balances WHERE id = $1 FOR UPDATE; 

The lock is held until transaction completion. 

## **11.10 Inventory Consumption** 

Inventory consumption is one of the highest-risk concurrent operations. 

Example: 

Available: 10 kg 

Operator A: consume 7 kg 

Operator B: consume 7 kg 

Both requests may arrive almost simultaneously. 

The system must NOT allow: 

10 - 7 - 7 = -4 kg 

## **11.11 Safe Inventory Consumption** 

Required flow: 

BEGIN 

↓ Lock inventory balance ↓ Read current quantity 

↓ 

Validate requested quantity 

↓ 

Create movement 

↓ Update balance ↓ Create audit ↓ COMMIT 

If Operator A commits first: 

10 → 3 kg 

Operator B then sees: 

3 kg available 

and its 7 kg request is rejected. 

## **11.12 Inventory Adjustment** 

Inventory adjustment must also lock the relevant inventory balance. 

Flow: 

BEGIN ↓ LOCK inventory row ↓ Read current quantity ↓ Validate adjustment ↓ Apply adjustment ↓ Create adjustment movement ↓ Audit ↓ COMMIT 

## **11.13 No Direct Balance Updates** 

Application code must not perform arbitrary balance manipulation. 

Forbidden pattern: 

UPDATE inventory_balances SET quantity = quantity + X 

without first validating the business transaction and locking the relevant record. 

All inventory changes must originate from an Inventory Service. 

## **11.14 Entity State Concurrency** 

State transitions must be protected against concurrent updates. 

Example: 

Carton: READY_TO_SHIP 

Two operators simultaneously request: 

Ship Carton 

Only one may succeed. 

## **11.15 Optimistic Locking** 

Core mutable entities should use optimistic locking where appropriate. 

Recommended field: 

version INTEGER NOT NULL DEFAULT 1 

Example: 

Carton version: 5 

Request A reads: 

version = 5 

Request B reads: 

version = 5 

Request A updates: 

WHERE id = X AND version = 5 

version → 6 

Request B then attempts: 

WHERE id = X AND version = 5 

No row is updated. 

Result: 

409 CONCURRENT_UPDATE 

## **11.16 Pessimistic vs Optimistic Locking** 

Use **pessimistic locking** for: 

Inventory balances Critical stock allocation Critical physical assignment 

###### Use **optimistic locking** for: 

Cartons Tasks Configuration drafts Operational records Manager dashboards 

This minimizes unnecessary database locking. 

## **11.17 State Transition Atomicity** 

A state transition must update the state and related business records in the same transaction. 

Example: 

Complete Carton 

must atomically: 

Validate carton Validate packages Update carton state Create required inventory movement Create audit 

The system must never commit the new carton state without the corresponding business effects. 

## **11.18 Duplicate Completion** 

Suppose: 

Operator A: Complete Operation 

Operator B: Complete Operation 

Both arrive simultaneously. 

Expected: 

Operator A → SUCCESS Operator B → CONFLICT / ALREADY_COMPLETED 

Only one completion event may exist. 

## **11.19 Database Constraint Protection** 

Application-level checks are not sufficient. 

Where possible, enforce uniqueness at the database level. 

Examples: 

UNIQUE(operation_number) UNIQUE(batch_number) UNIQUE(package_serial) UNIQUE(carton_number) UNIQUE(shipment_number) UNIQUE(label_serial) 

The database is the final protection against duplicate identifiers. 

## **11.20 Unique Physical Identity** 

A physical serial must identify exactly one active entity. 

Examples: 

Basket Serial Package Serial Carton Number Label Serial 

Two concurrent requests attempting to create the same serial must result in only one successful creation. 

## **11.21 Duplicate Scan Handling** 

Scanning the same entity twice must be classified according to the operation. 

Example: 

Scan Basket B-001 ↓ SUCCESS 

Second scan: 

Scan Basket B-001 ↓ Already processed ↓ DUPLICATE_SCAN 

The second scan must not create a second inventory transaction. 

## **11.22 Idempotency** 

Every business-changing API request must support: 

Idempotency-Key 

Examples: 

POST /receiving POST /operations/{id}/complete POST /inventory/movements POST /packages POST /cartons/{id}/complete POST /labels/{id}/print POST /labels/{id}/reprint POST /shipments/{id}/load POST /overrides/{id}/approve 

## **11.23 Idempotency Storage** 

The backend should store idempotency information: 

idempotency_key user_id endpoint request_hash response_status response_body created_at 

The key should be unique within the appropriate scope. 

Recommended: 

UNIQUE(user_id, endpoint, idempotency_key) 

## **11.24 Idempotency Rules** 

If the same request is repeated with the same key: 

First: Execute transaction 

Second: Return original result 

Do not execute the business transaction again. 

## **11.25 Idempotency Conflict** 

If the same idempotency key is reused with a different payload: 

Idempotency-Key: ABC123 

First payload: 

{ "quantity": 10 } 

Second payload: 

{ "quantity": 20 

} 

The system must return: 

409 IDEMPOTENCY_KEY_REUSED 

It must not execute the second request. 

## **11.26 Network Timeout Scenario** 

This is especially important for Android scanners. 

Scenario: 

Scanner 

↓ POST operation ↓ Server executes successfully 

↓ Database COMMIT ↓ Network fails ↓ Scanner receives timeout 

The scanner does not know whether the operation succeeded. 

It must retry using the same: 

Idempotency-Key 

The backend returns the original result. 

This prevents duplicate processing. 

## **11.27 Never Generate a New Idempotency Key During Retry** 

Incorrect: 

Request 1 → KEY-A Timeout 

Retry → KEY-B 

Correct: 

Request 1 → KEY-A Timeout 

Retry → KEY-A 

The client must preserve the original key until the transaction result is known. 

## **11.28 Transaction Timeout** 

Transactions must not remain open indefinitely. 

Recommended starting values: 

Normal business transaction: 

≤ 5 seconds 

Critical long-running transaction: special handling required 

Long physical processes such as: 

Freeze Drying Drying Freezing 

must NOT keep a database transaction open for the entire physical process. 

## **11.29 Long-Running Process Model** 

Correct: 

START FREEZE DRYING 

↓ 

Short DB Transaction 

↓ 

STATUS = RUNNING 

↓ Physical process ↓ COMPLETE FREEZE DRYING ↓ Short DB Transaction 

↓ 

STATUS = COMPLETED 

Incorrect: 

BEGIN TRANSACTION 

Start machine 

Keep transaction open for 12 hours 

COMMIT 

## **11.30 Session Concurrency** 

A user may be logged into more than one device only if permitted by configuration. 

Possible policy: 

Operator: 

1 active session 

Manager: 2 active sessions 

Admin: Multiple sessions 

The exact limit should be configurable. 

## **11.31 Session Race Condition** 

Two devices attempt to create a session for the same user simultaneously. 

The backend must enforce the configured session limit atomically. 

If maximum active sessions = 1: 

Device A → SUCCESS Device B → REJECT 

## **11.32 Task Claiming** 

Tasks may be claimed by multiple operators. 

The system must ensure that only one operator can claim a task if the task is single-assignee. 

Safe flow: 

BEGIN 

SELECT task FOR UPDATE 

Validate status = AVAILABLE 

Assign user status = ASSIGNED 

COMMIT 

## **11.33 Task Double Claim** 

Two operators: 

Operator A → Claim Task Operator B → Claim Task 

Expected: 

A → SUCCESS 

B → TASK_ALREADY_ASSIGNED 

## **11.34 Task Reassignment** 

Reassignment must be atomic. 

BEGIN Lock task Validate permission Validate task state Change assignee Create audit COMMIT 

## **11.35 Package Assignment to Carton** 

A package may not be assigned to two active cartons. 

Example: 

Package P-001 

Operator A: 

Carton C-001 

Operator B: 

Carton C-002 

Only one assignment can succeed. 

This must be protected by: 

- Transaction 

- Lock 

- Database uniqueness/business constraint 

## **11.36 Carton Completion Race** 

If two users attempt to complete the same carton: 

C-001 READY 

Expected: 

User A → COMPLETED User B → CONFLICT 

No duplicate completion records. 

## **11.37 Shipment Loading Race** 

A carton must not be loaded into two shipments. 

Example: 

Carton C-001 

Shipment S-001 Shipment S-002 

Concurrent requests must be serialized. 

The first successful load wins. 

The second receives: 409 CARTON_ALREADY_LOADED 

## **11.38 Shipment Completion Race** 

Two users attempt: 

Complete Shipment S-001 

Only one completion may occur. 

The second request returns: 409 ALREADY_COMPLETED 

## **11.39 Label Printing Concurrency** 

Two users may attempt to print the same label. 

The system must distinguish: 

PRINT 

from: 

REPRINT 

A normal print must not create multiple independent label identities. 

The label identity belongs to the carton. 

Print attempts belong to the label. 

## **11.40 Label Print Lock** 

When a label is being generated: 

LABEL ↓ PRINTING 

A second print request should either: 

- Wait briefly 

- Return PRINT_IN_PROGRESS 

- Or be treated as the same idempotent request 

It must not generate conflicting label data. 

## **11.41 Reprint Concurrency** 

Two simultaneous reprint requests may be allowed. 

Example: 

Reprint #2 Reprint #3 

Both may exist as print attempts. 

But both must reference the same: 

label_serial carton_id 

No new carton or package may be created. 

## **11.42 Manager Override Concurrency** 

Two managers attempt to approve the same override. 

Example: 

Override: 

PENDING 

Manager A: 

APPROVE 

Manager B: 

APPROVE 

Expected: 

###### A → SUCCESS 

B → ALREADY_RESOLVED 

Only one final decision may exist. 

## **11.43 Self-Approval Race** 

A user requests an override and then attempts to approve it through another device. 

The backend must still reject: 

requester_id == approver_id 

unless the business explicitly defines an exception. 

## **11.44 Configuration Concurrency** 

Two users modify the same configuration. 

Recommended model: 

Configuration Version version = 4 

User A reads version 4. 

User B reads version 4. 

User A saves: 

- 4 → 5 

User B attempts: 

4 → 5 

Result: 

409 CONCURRENT_UPDATE 

User B must reload before modifying again. 

## **11.45 Configuration Activation Race** 

Two users attempt to activate different configuration versions. 

Only one version may become active for the same configuration scope. 

The database must prevent: 

Configuration A: Version 5 = ACTIVE Version 6 = ACTIVE 

if the business rule allows only one active version. 

## **11.46 Inventory and Processing Transaction** 

A processing operation that consumes inventory and creates output must be atomic. 

Example: 

Sorting 

Input: 100 kg 

Outputs: 40 kg A 35 kg B 20 kg C 5 kg loss 

The transaction must ensure: 

Input consumption + Output creation + Inventory movements + Genealogy + Operation completion + Audit 

are committed together. 

## **11.47 Processing Failure** 

If output creation fails: 

Input consumption 

must also roll back. 

The system must not produce: 

Input: -100 kg 

Output: 0 kg 

as a committed incomplete transaction. 

## **11.48 Physical Process vs Database Transaction** 

Physical machine execution is not itself a database transaction. 

Example: 

Start Freeze Dryer ↓ 

DB: RUNNING 

Machine runs 

Machine finishes 

↓ 

DB: COMPLETED 

If the machine fails: 

DB: FAILED 

A new operation may be created for retry if the business process allows it. 

## **11.49 Failure Recovery** 

If the application server crashes during a transaction: 

Transaction not committed 

↓ 

Database rollback 

If the transaction was committed: 

Transaction remains committed 

The client should discover the result using: 

Idempotency-Key 

or operation lookup. 

## **11.50 Deadlock Handling** 

Deadlocks may occur when multiple transactions lock resources in different orders. 

All services must follow a consistent lock order. 

Example: 

1. Batch 

2. Inventory 

3. Package 

4. Carton 

5. Shipment 

The exact ordering must be standardized by the backend team. 

Transactions should never randomly acquire locks in different orders. 

## **11.51 Deadlock Retry** 

If PostgreSQL reports a deadlock: 

Transaction fails ↓ ROLLBACK ↓ Retry 

Retry should be limited. 

Recommended: Maximum automatic retries: 2–3 

If retry still fails: 

409 / 503 appropriate error 

and the event must be logged. 

## **11.52 Serialization Failure Retry** 

If the database reports a serialization conflict: 

ROLLBACK 

and the application may retry the transaction if the operation is safe and idempotent. 

## **11.53 Lock Duration** 

Locks must be held for the shortest possible time. 

Do NOT: 

Lock inventory 

↓ 

Call external API 

↓ 

Wait 5 seconds 

↓ Print label ↓ Commit 

Instead: 

Prepare data 

↓ BEGIN 

↓ Lock 

↓ Update 

↓ COMMIT 

↓ External action 

Where business consistency permits. 

## **11.54 External Services** 

External operations such as: 

- Printer 

- Email 

- ● Notification 

###### ● External API 

must not normally be performed while holding critical database locks. 

## **11.55 Label Printing Architecture** 

Preferred: 

Business Transaction 

↓ Create Label Job ↓ COMMIT ↓ Printer Service ↓ Print 

↓ Update Print Attempt 

The database transaction should not remain open while waiting for the printer. 

## **11.56 Print Job State** 

Recommended: 

QUEUED PRINTING SUCCESS FAILED 

This allows the system to recover from printer failures. 

## **11.57 Exactly-Once vs At-Least-Once** 

The system must distinguish between: 

###### **Exactly-once business effect** 

Required for: 

Inventory consumption Batch creation Carton completion Shipment loading Override approval 

###### **At-least-once physical attempt** 

Acceptable for: 

Label printing Notifications External integrations 

This distinction is critical. 

## **11.58 Business Transaction vs Physical Action** 

The database guarantees business consistency. 

It cannot guarantee that a physical printer, machine, or human action occurred exactly once. 

Therefore: 

Database: exactly-once business record 

Physical world: tracked attempts + confirmation 

## **11.59 Audit Under Concurrency** 

Audit records must preserve chronological execution order using server-side timestamps. 

Where necessary, also store: 

request_id transaction_id sequence number 

This allows reconstruction of concurrent events. 

## **11.60 Request Ordering** 

The system must not assume that requests arrive in the same order in which operators performed actions. 

Example: 

Operator physically scans A Operator physically scans B 

Network: B arrives first A arrives second 

The backend processes based on actual transaction arrival and entity state. 

If order matters, the business operation must explicitly enforce it. 

## **11.61 Client Retry Rules** 

When the client receives: 

408 429 502 503 

504 

it may retry according to endpoint rules. 

For business-changing endpoints: 

Retry using the SAME idempotency key. 

## **11.62 Retry Backoff** 

Recommended exponential backoff: 

Attempt 1: ~500 ms 

Attempt 2: ~1 sec 

Attempt 3: ~2 sec 

with random jitter. 

Do not retry indefinitely. 

## **11.63 Rate Limiting** 

The API should implement rate limits for: 

- Login 

- Password reset 

- High-frequency scan endpoints 

- Public endpoints 

- Administrative APIs 

Rate limiting must not interfere with legitimate high-speed warehouse scanning. 

Scan endpoints should be designed for controlled high throughput. 

## **11.64 High-Frequency Scanning** 

The scanner application should avoid sending unnecessary duplicate requests. 

Preferred: 

Scan ↓ Validate locally ↓ Send transaction ↓ Wait for result ↓ Display result 

Not: 

One scan ↓ 5 identical API calls 

## **11.65 Transaction Monitoring** 

Production monitoring must track: 

Transaction duration Deadlocks Rollback rate Lock wait time Database connection pool Failed commits Idempotency conflicts Concurrency conflicts 

## **11.66 Performance Targets** 

Initial Version 1 targets: 

###### **Normal read request** 

P95 < 500 ms 

###### **Normal business transaction** 

P95 < 1.5 seconds 

###### **Scan-to-result workflow** 

P95 < 2 seconds 

These are initial engineering targets and must be validated under realistic warehouse load. 

## **11.67 Database Connection Pool** 

The backend must use a controlled connection pool. 

The number of connections must not be allowed to grow without limit. 

Configuration should be tuned based on: 

Database capacity API instances Expected concurrency Query duration 

## **11.68 Transaction Logging** 

Long-running transactions should be detectable. 

The system should log transactions exceeding the defined threshold. 

Example: 

Transaction duration: 7.8 sec 

Threshold: 5 sec 

###### → WARNING 

## **11.69 Concurrency Acceptance Tests** 

The following tests are mandatory. 

###### **Test 1 — Double Inventory Consumption** 

Available = 10 kg 

A consumes 7 kg B consumes 7 kg simultaneously 

Expected: One succeeds One fails Final balance = 3 kg 

###### **Test 2 — Double Carton Completion** 

A completes C-001 B completes C-001 simultaneously 

Expected: One succeeds One receives conflict 

###### **Test 3 — Double Shipment Load** 

C-001 → S-001 C-001 → S-002 

Expected: Only one succeeds 

###### **Test 4 — Duplicate Network Retry** 

Request succeeds Response lost 

Client retries same Idempotency-Key 

Expected: No duplicate transaction 

###### **Test 5 — Double Override Approval** 

Manager A approves Manager B approves simultaneously 

Expected: One approval One conflict 

###### **Test 6 — Configuration Conflict** 

A edits version 4 B edits version 4 

A saves B saves 

Expected: A succeeds B receives CONCURRENT_UPDATE 

## **11.70 Concurrency Acceptance Criteria** 

The implementation is accepted only when: 

- Inventory can never become negative because of race conditions. 

- The same business action cannot be committed twice. 

- Duplicate scans do not duplicate inventory transactions. 

- Duplicate network retries do not duplicate business transactions. 

- Two users cannot complete the same single-completion operation twice. 

- A carton cannot belong to two shipments simultaneously. 

- A package cannot belong to two active cartons simultaneously. 

- Only one manager can resolve a single override. 

- Configuration version conflicts are detected. 

- Deadlocks are handled safely. 

- Long-running physical processes do not hold database transactions open. 

- All critical operations are atomic. 

- Audit records correctly represent committed business events. 

## **11.71 Final Concurrency Model** 

The system should follow this general model: 

CLIENT │ ▼ Idempotency Key │ ▼ API Server │ ▼ Authorization │ ▼ Business Service │ ▼ BEGIN TRANSACTION │ ┌────────┴────────┐ │                 │ ▼                 ▼ Lock / Version      Validate State │                 │ └────────┬────────┘ ▼ Execute Business │ ▼ Create Audit/Event │ ▼ COMMIT │ ▼ 

Return Result 

## **11.72 Final Rule** 

The development team must assume: 

###### **Two users can click the same button at exactly the same time.** 

The system must remain correct. 

The correct outcome must be determined by: 

Database Transaction + Locking / Optimistic Versioning + Unique Constraints + State Machines + Idempotency + Business Rules 

Never by: 

UI button disabling JavaScript flags Client-side timers Operator discipline 

Client-side controls improve usability. 

They do not provide concurrency safety. 

11.73 Version 1 Boundary 

Version 1 requires strong transactional integrity within each site but does not require: 

- Distributed transactions across multiple sites 

- Multi-region active-active database architecture 

- Complex event sourcing infrastructure 

- Kafka-based distributed transaction orchestration 

- CRDT-based conflict resolution 

These would add unnecessary complexity to Version 1. 

Within each site, the system should use: One primary relational database (per site) + ACID transactions + Controlled application services + Idempotency + Row-level locking + Optimistic concurrency 

as the baseline architecture. All concurrency guarantees in this chapter (locking, ACID, idempotency) apply within a single site's database — they do not span sites. 

Between sites, no distributed transaction is used. Instead: each site queues its own events locally (Outbox) and pushes them to the read-only Cloud Aggregation layer once connectivity allows. The Iran site in particular relies on this local queue during international connectivity interruptions. This is intentionally simple — asynchronous one-way replication, not synchronous cross-site consistency — because no business operation in this system requires two different sites to commit the same transaction together. 

## **11.74 Final Implementation Statement** 

For every business operation, the development team must be able to answer four questions: 

1. **What happens if two users do it simultaneously?** 

2. **What happens if the network fails after the database commits?** 3. **What happens if the client retries?** 4. **What happens if the application crashes halfway through?** 

If these four questions do not have deterministic answers, the operation is not ready for production. 

# L. ERROR HANDLING 

###### 12. ERROR HANDLING SPECIFICATION Version 1.0 

###### 12.1 Purpose 

This document defines how the system detects, classifies, reports, logs, and recovers from errors across all clients (Web, Raspberry Pi Terminal, Android PDA) and all layers (API, business services, database, devices, network). The objective is that every error has a predictable, documented behavior — nothing fails silently, and nothing blocks an operator without a clear, actionable message. 

12.2 Error Categories VALIDATION — malformed or missing input BUSINESS_RULE — a defined Business Rule (Chapter D) was violated AUTHORIZATION — user lacks permission for the action NOT_FOUND — referenced entity does not exist CONFLICT — concurrent modification or duplicate request (see Chapter K) DEVICE — scale, scanner, or printer failure NETWORK — connectivity failure between client and its site's server SITE — cross-site access attempted (see Chapter D, BR-SITE-001) SYSTEM — unexpected server-side failure 

12.3 Error Response Format Every error follows the common response format defined in Chapter F (API Specification), section 1.5: 

{ "success": false, "message": "Human-readable summary", "errorCategory": "BUSINESS_RULE", "errorCode": "BR-SORT-005", "errors": [] } 

errorCode references the specific Business Rule ID (Chapter D) when the category is BUSINESS_RULE, or a category-specific code otherwise (see 12.5). 

12.4 HTTP Status Code Mapping VALIDATION → 400 AUTHORIZATION → 403 NOT_FOUND → 404 CONFLICT → 409 BUSINESS_RULE → 422 

SITE → 403 DEVICE → 409 or 503 depending on whether a retry is possible NETWORK → 503 (client-observed, not server-generated) SYSTEM → 500 

###### 12.5 Business Rule Violation Errors 

When an action is blocked by a Business Rule (Chapter D), the response errorCode is always the rule's own ID (e.g. BR-SORT-005, BR-SITE-001, BR-SH-001). This keeps error handling and business rules as a single source of truth — there is no separate, parallel list of error codes for business logic. 

###### 12.6 Validation Errors 

Validation errors return a list of field-level problems: 

{ "field": "weight", "issue": "must be greater than 0" 

} Validation happens before any business rule is evaluated. A request that fails validation never reaches business logic. 

12.7 Device Errors Scale Disconnected 

The terminal shall allow the operator to retry, switch to another registered scale at the same site, or escalate to a supervisor. The active Session is not lost (see Chapter A, 14. SessionBased Operation Model). 

Printer Failure 

The print job is queued as PENDING (see Print Management, Chapter A/F). The operation that triggered printing is not blocked — the basket, batch, or carton QR remains valid without a physical label until the queue succeeds. 

Scanner Failure 

The operator may select the object manually from a list as a fallback. This is logged as a DEVICE exception (Chapter D, 4.22 Exception Rules). 

###### 12.8 Network Errors — Client to Local Site Server 

If a terminal temporarily loses connection to its own site's server, the client must follow the rule defined in Chapter D (4.38 Offline/Network Failure Rules): never report success until the server confirms the transaction. The UI shows PENDING, not SUCCESS, until confirmation arrives or the request is safely retried using its idempotency key (Chapter K, 11. Concurrency & Transaction Specification). 

This is distinct from Site-to-Cloud connectivity — see 12.9. 

###### 12.9 Site-to-Cloud Connectivity Errors 

This category is separate from 12.8 because it operates at a different layer. Loss of connectivity between a site's local server and the Cloud Aggregation service (most relevant for Iran — see Chapter A, 9.21) is NOT treated as an application error. It never blocks or degrades any operation at the site. The site's Outbox Queue absorbs the gap silently; only the Cloud Aggregation reporting layer shows a "last synced" indicator until the queue drains. No operatorfacing error is generated for this condition. 

###### 12.10 Site Isolation Errors 

An attempt to read or write data belonging to a site other than the authenticated user's current site (Chapter D, BR-SITE-001) returns errorCategory = SITE, HTTP 403. This includes attempts to use a token issued by one site's server against another site's API (Chapter F, 1.3–1.4). A site's failure, downtime, or error state never affects any other site. 

###### 12.11 Concurrency Errors 

Handled per Chapter K. When two requests conflict (e.g. two operators attempting to consume the same batch), the losing request receives errorCategory = CONFLICT, HTTP 409, with enough detail to explain what already happened (e.g. which Work Order/Task now owns the resource). 

###### 12.12 Session Errors 

An action attempted against an EXPIRED, REVOKED, or CLOSED session (Chapter G, 7.21 Session State Machine) is rejected with errorCategory = AUTHORIZATION, HTTP 401, and a message directing the operator to resume or start a new session. 

###### 12.13 Data Integrity Errors 

Errors such as a broken traceability link, an orphaned reference, or a state/inventory mismatch (see Chapter H, Critical Edge Cases 8.113–8.114) are logged as SYSTEM-category errors, automatically create a HIGH or CRITICAL exception (Chapter D, 4.22), and are never silently corrected — a human must review and resolve them. 

###### 12.14 Manager Override Errors 

An override request that is expired, already resolved, or attempted by an unauthorized user returns errorCategory = AUTHORIZATION or BUSINESS_RULE as appropriate, consistent with Chapter D (4.23 Manager Override Rules) and Chapter H (8.107–8.108 Critical Edge Cases). 

###### 12.15 Error Logging and Audit 

Every error with category BUSINESS_RULE, AUTHORIZATION, SITE, CONFLICT, or 

SYSTEM is recorded in audit_logs (Chapter C, 3.34) with user, device, site, session, timestamp, and the error code. VALIDATION errors are not individually audited unless repeated beyond a configurable threshold (possible abuse or a broken client). 

###### 12.16 User-Facing Error Messages 

Terminal and PDA clients never display raw system errors, stack traces, or database messages. Every error category maps to a short, operator-friendly message defined in configuration (Chapter A, 15. Configuration Philosophy), so wording can be corrected or translated without a software release. 

###### 12.17 Retry Policy 

Idempotent operations (Chapter K, 11. Concurrency & Transaction Specification) may be retried automatically by the client using the same idempotency key. Non-idempotent read operations may be retried freely. The client must apply exponential backoff for repeated NETWORK or SYSTEM errors rather than retrying immediately in a loop. 

###### 12.18 Escalation 

CRITICAL severity exceptions (Chapter D, 4.22) — such as repeated print failures, a device offline for an extended period, or a data integrity error — generate a notification to the site's Manager/Admin (Chapter A, 10. Software Modules — Notification). Escalation is always sitescoped; a critical error at one site never notifies staff at another site unless explicitly configured. 

###### 12.19 Final Error Handling Principle 

For every error category in this chapter, the development team must be able to answer: what does the operator see, what is recorded, and does production continue or stop? An error with an undefined answer to any of these three questions is not ready for production. 

# M. NON-FUNCTIONAL REQUIREMENTS 

###### 13. NON-FUNCTIONAL REQUIREMENTS Version 1.0 

###### 13.1 Purpose 

This document defines the quality attributes Version 1 must satisfy beyond its functional behavior: performance, availability, reliability, scalability, security posture, maintainability, and operational limits — per site, since each site (Iran, Dubai, Rome) runs its own independent local server and database (Chapter A, 8–9). 

###### 13.2 Performance Requirements 

Local API responses (same site): 95% under 300ms for read operations, under 800ms for write/business-transaction operations, measured at the site's own server — not across sites. QR scan to screen response on Raspberry Pi Terminal and Android PDA: under 1 second. Cross-site Cloud Aggregation reports (Chapter F, 1.3): under 3 seconds, since these read from a replica, not live site data. 

###### 13.3 Availability Requirements 

Each site's local Application Server and Database: 99.5% uptime during production hours, independent of the other two sites and independent of Cloud Aggregation availability. Cloud Aggregation service: best-effort; its unavailability must never affect any site's local operations (Chapter A, 9.21; Chapter L, 12.9). 

Planned maintenance at one site must not require downtime at another site. 

###### 13.4 Scalability Requirements 

Each site's database shall support at minimum 3 years of full operational history (all EventSourced tables, Chapter C) before archiving is required. 

Adding a fourth site (a future warehouse or factory) shall require only a new sites row (Chapter C, 3.10b) and a new local server deployment — no schema or application changes. 

Adding a new product line (Chapter A, 15. Configuration Philosophy) shall require only configuration changes, not redeployment. 

###### 13.5 Reliability Requirements 

No committed business transaction (Chapter K) may ever be lost due to application or server failure. 

Event-Sourced records (weight history, quality corrections, inventory adjustments, audit logs) are immutable and retained indefinitely (Chapter D, 4.40 Audit vs Business History). 

###### 13.6 Backup and Recovery 

Each site performs its own daily full database backup (Chapter A, 9.5), independent of the other sites. 

Recovery Point Objective (RPO) per site: maximum 24 hours of data loss in a worst-case local disaster, reducible with incremental backups. 

Recovery Time Objective (RTO) per site: local operations restorable within 4 hours of a server failure being identified. 

Backups from one site are never required to restore another site — sites are fully independent for recovery purposes. 

###### 13.7 Disaster Recovery 

If a site's local server is lost entirely, that site restores from its most recent local backup and replays any Outbox entries confirmed as sent but not yet reflected — see Chapter A, 9.21 for the Iran-specific case, where extended offline operation makes this recovery path more likely to be exercised than at Dubai or Rome. 

Cloud Aggregation, holding a synchronized read-only copy, may assist in reconstructing recent history but is never the primary recovery source — the site's own backup is authoritative. 

###### 13.8 Security Requirements 

See Chapter J (Security / Permissions) for the full specification. Non-functional summary: leastprivilege roles, server-side authorization only, no direct database access from any client, and site-scoped authentication tokens (Chapter F, 1.4) that cannot be used across sites. 

###### 13.9 Data Retention Policy 

Purchase/receiving, production, packaging, shipping, and audit records: retained indefinitely, never deleted (Chapter D, 3.44 Immutability Rules; 4.40). 

Configuration history: versioned indefinitely (Chapter A, 15). Session records: retained for audit purposes even after closure. 

No table in this system supports hard deletion of business data — only status changes (Chapter C, 3.51 Soft Delete Policy). 

###### 13.10 Usability Requirements 

Maximum three clicks/scans to reach any operational function (Chapter E, 1.20 Navigation Principles). 

New operator productive within one working day of training, consistent with the system's Scan Instead of Type principle (Chapter A, 6.3). 

Terminal and PDA interfaces remain usable with industrial gloves and in cold-storage conditions (large touch targets, no fine text entry). 

###### 13.11 Maintainability Requirements 

Modular architecture (Chapter A, Software Modules) allows any one module to be modified or 

###### replaced without redeploying unrelated modules. 

All cross-module communication happens through the documented API (Chapter F) — no module accesses another module's database tables directly. 

###### 13.12 Localization Requirements 

Iran, Dubai, and Rome operate in different time zones; every timestamp stored is in UTC, with each site's local server converting to local time for display (Chapter A, 9. Physical Infrastructure covers per-site servers; this section covers display, not storage). 

Version 1 UI language: English, with the underlying label/message configuration (Chapter A, 15) structured so additional languages can be added without code changes. 

Currency and unit display may differ by site configuration but does not affect the underlying stored quantities (always metric, per Chapter C). 

###### 13.13 Compliance Considerations 

The system produces the traceability data (Chapter A, 13. Traceability Concept) that export certification, customs, and quality documentation typically require, but does not generate those documents itself — that remains out of scope for Version 1 (Chapter A, 5. Out of Scope). Laboratory-grade compliance (chemical/microbiological certification) is explicitly out of scope; only operational QC is covered. 

###### 13.14 Monitoring and Observability 

Every device (Chapter A, 9. Physical Infrastructure) reports a heartbeat; a site's Exception Dashboard (Chapter A, Dashboard module) surfaces offline devices, stalled print queues, and repeated errors (Chapter L, 12.18) for that site only. 

Cloud Aggregation provides a secondary, cross-site view of each site's sync status (Chapter D, BR034-equivalent — Chapter A, 9.21) for management, but is not the primary monitoring path for any single site's day-to-day operations. 

###### 13.15 Capacity Planning 

Estimated baseline volume per site: low thousands of receiving/production/packaging operations per month. Each site's local database and server sizing (Chapter A, 9.4–9.5) is based on its own volume, not combined multi-site volume — sites do not share compute or storage capacity. 

###### 13.16 Network Requirements 

Each site requires stable local Wi-Fi/wired connectivity for its terminals to reach its own local server (Chapter A, 9. Physical Infrastructure) — this local network is separate from, and not dependent on, the site's international connectivity to Cloud Aggregation (Chapter A, 9.21). 

13.17 Final Non-Functional Principle 

Every non-functional requirement in this chapter is evaluated per site first, and only secondarily at the aggregate (Cloud) level. A requirement that can only be satisfied by assuming a single shared server or database is not compatible with this system's architecture (Chapter A, 4.6; Chapter C, 3.39b; Chapter K, 11.73) and must be rewritten before it is accepted. 

