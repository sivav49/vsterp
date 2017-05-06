import {Invoice, InvoiceItem} from './invoice.model';

export default [
  new Invoice(2040, 1209, new Date(2017, 4, 5),
    'Vadapalani Press', 'No. 25, SIDCO Industrial Estate,\nAmbattur,\nChennai - 600 098.', '33491923678',
    'Towards Cost of Printing & Supplying\nOPJ: 3411', false, [
      new InvoiceItem(1,
        'Lines Printing - Big\n1 Set, Single Colour (Special), 11000 Imp.\nPlate = 350\nFirst 1000 Printing = 300\nAdd. 1000 Printing: 10 x 250 = 2500',
        1, 3150, 3150),
      new InvoiceItem(2,
        'Lines Printing - Small\n1 Set, Single Colour (Special), 1500 Imp.\nPlate = 350\nFirst 1000 Printing = 300\nAdd. 1000 Printing: 1 x 250 = 250',
        1, 900, 900),
      new InvoiceItem(3,
        'Last Page Printing - Big\n1 Set, Single Colour, 150 Imp.\nPlate = 350\nPrinting = 300',
        1, 650, 650),
      new InvoiceItem(4,
        'Last Page Printing - Small\n1 Set, Single Colour, 100 Imp.\nPlate = 350\nPrinting = 300',
        1, 650, 650),
    ], 5350, 5, 267.50, 5617.50),
  new Invoice(2039, 1208, new Date(2017, 4, 5),
    'Vadapalani Press', 'No. 25, SIDCO Industrial Estate,\nAmbattur,\nChennai - 600 098.', '33491923678',
    'Towards Cost of Printing & Supplying\nOPJ: Not Available', false, [
      new InvoiceItem(1,
        'Park Hyatt - Paper Bag Big\n2 Set, 4 Colour, 1200 Copies\nReprint',
        2, 1500, 3000),
      new InvoiceItem(2,
        'Park Hyatt - Paper Bag Small\n1 Set, 4 Colour, 1200 Copies\nPlate & Printing',
        1, 2500, 2500),
      new InvoiceItem(3,
        'A Bond Strands - Folder\n2 Set, 4 Colour, 2000 Copies\nBoth Side Matt Lamination\nDie Making, Punching & Pasting',
        2000, 10, 20000)
    ], 25500, 5, 1275, 26775),
  new Invoice(2038, 1207, new Date(2017, 4, 5),
    'Global Printing Press', '37, Seewaram, 3rd Street,\nPerungudi, Chennai - 600 096', '',
    'Towards Cost of Printing & Supplying', false, [
      new InvoiceItem(1,
        'Hail Arunachala - Book\nSize 180 x 240mm, 216 Pages\n112 Page Multi Colour Printing\n104 Pages Single Colour Printing\nMatt Lamination, Gold Foiling & Perfect Binding',
        1000, 52, 52000),
    ], 52000, 5, 2600, 54600),
  new Invoice(2037, 1206, new Date(2017, 3, 29),
    'Sontham Printers & Publishers', 'No 64, Madurai Swamy Madam Street,\nPerambur, Chennai - 600 011', '33901040746',
    'Towards Cost of Printing & Supplying', true, [
      new InvoiceItem(1,
        'Bharat Gas Petroleum - Letterhead\nReprint, 27500 Imp\nPrinting First 1000 Imp. = Rs. 1200\nPrinting Add. 26500 Imp. 27 x Rs. 300 = Rs. 8100\nCutting Charges 110 x Rs. 25 = Rs. 2750\nTotal = Rs. 12050',
        1, 12050, 12050),
    ], 12050, 5, 602.5, 12652.5),
  new Invoice(2036, 1207, new Date(2017, 3, 29),
    'Vasuki Printers', 'No. 5, South Perumal Koil Lane,\nChennai - 600 026', '33621465954',
    'Towards Cost of Printing & Supplying', false, [
      new InvoiceItem(1,
        'NDE - Letterhead\n1 Set Plate & Printing x 600 Imp.',
        1, 1800, 1800),
      new InvoiceItem(2,
        'Rhapsody - Notice S/Side\n1 Set Plate & Printing x 345 Imp.',
        1, 1800, 1800),
      new InvoiceItem(2,
        'Rhapsody - Notice S/Side\n1 Set Reprint x 1500 Imp.',
        1, 1400, 1400),
    ], 5000, 5, 250, 5250),
  new Invoice(2035, undefined, new Date(2017, 3, 29),
    'Vadapalani Press', 'No. 25, SIDCO Industrial Estate,\nAmbattur,\nChennai - 600 098.', '33491923678',
    'Towards Cost of Printing & Supplying\nOPJ: 3408', false, [
      new InvoiceItem(1, 'Hindi Varnamala Book - 2 & 3\nSize: 180 x 240 mm\n40 Pages, 4 Colour, 1000 Copies\nInner Plate: 5 Set x 1000 = 5000\nInner Printing: 5 Set x 1000= 5000\nWrapper Plate & Printing (Combined) = 1000\nLamination: 11 x 16 x 1050 x 0.40 / 100 = 740\nBinding: 4 forms x 1 x 200 = 800',
        2, 12540, 25080),
      new InvoiceItem(2, 'Hindi Writing Book - 3\nSize: 180 x 240 mm\n32 Pages, 2 Colour, 1000 Copies\nInner Plate: 8 x 350 = 2800\nInner Printing: 8 x 300 = 2400\nWrapper Plate & Printing = 2000\nLamination: 11 x 16 x 1050 x 0.40 / 100 = 740\nBinding: 3 forms x 1 x 200 = 600',
        1, 8540, 8540)
    ], 33620, 0, 0, 33620),
  new Invoice(2035, undefined, new Date(2017, 3, 29), 'WORD OF CHRIST MINISTRIES', 'No. 100/3, Nirmala Apartments,\nMedavakkam Tank Road, Kellys,\nChennai - 600 010.', '',
    'Towards Cost of Printing & Supplying\nOPJ: 3408', false, [
      new InvoiceItem(1, 'Yesuvin Pathapadiyil\n72 Pages, 3000 Copies\nSize 140 x 215 mm\nInner Single-Colour Printing\n60 GSM White Maplitho\nCover Multi-Colour Printing\n250 GSM Art Board\nLamination & Perfect Binding',
        3000, 13, 39000)
    ], 39000, 5, 1950, 40950),
];
