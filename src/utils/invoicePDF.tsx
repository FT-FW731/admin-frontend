import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  pdf,
  Image,
} from "@react-pdf/renderer";
import logo from "../assets/logo.png";

const styles = StyleSheet.create({
  page: {
    fontFamily: "Helvetica",
    fontSize: 10,
    paddingTop: 20,
    paddingLeft: 30,
    paddingRight: 30,
    paddingBottom: 30,
    backgroundColor: "#FFFFFF",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 30,
  },
  logo: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#4A90E2",
  },
  invoiceTitle: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "right",
    color: "#333",
  },
  invoiceNumber: {
    fontSize: 12,
    textAlign: "right",
    color: "#666",
    marginTop: 5,
  },
  companySection: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 30,
  },
  companyInfo: {
    flex: 1,
  },
  billTo: {
    flex: 1,
    textAlign: "right",
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#333",
  },
  companyName: {
    fontSize: 11,
    fontWeight: "bold",
    marginBottom: 3,
  },
  address: {
    fontSize: 9,
    color: "#666",
    marginBottom: 2,
  },
  invoiceDetails: {
    textAlign: "right",
    marginBottom: 30,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginBottom: 3,
    gap: 1,
  },
  detailLabel: {
    fontSize: 10,
    color: "#666",
    width: 120,
    textAlign: "right",
    marginRight: 10,
  },
  detailValue: {
    fontSize: 10,
    color: "#333",
    width: "50px",
    textAlign: "left",
  },
  table: {
    marginBottom: 0,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#4A5568",
    paddingVertical: 8,
    paddingHorizontal: 5,
  },
  tableHeaderText: {
    color: "white",
    fontSize: 10,
    fontWeight: "bold",
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 0.5,
    borderBottomColor: "#E2E8F0",
    paddingVertical: 8,
    paddingHorizontal: 5,
    minHeight: 35,
  },
  tableCell: {
    fontSize: 9,
    color: "#333",
    paddingRight: 5,
  },
  itemNumber: {
    width: "8%",
    textAlign: "center",
  },
  itemName: {
    width: "40%",
  },
  itemCode: {
    width: "10%",
    textAlign: "center",
  },
  itemMonths: {
    width: "15%",
    textAlign: "center",
  },
  itemRate: {
    width: "15%",
    textAlign: "right",
  },
  itemAmount: {
    width: "20%",
    textAlign: "right",
  },
  totalsSection: {
    backgroundColor: "#F7FAFC",
    padding: 10,
    paddingBottom: 8,
    paddingTop: 8,

    marginBottom: 8,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginBottom: 0,
    marginTop: 4,
  },
  totalLabel: {
    fontSize: 10,
    color: "#666",
    width: 100,
    textAlign: "right",
    marginRight: 20,
  },
  totalValue: {
    fontSize: 10,
    color: "#333",
    width: 80,
    textAlign: "right",
  },
  finalTotalRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    borderTopWidth: 1,
    borderTopColor: "#E2E8F0",
    paddingTop: 4,
    marginTop: 4,
  },
  finalTotalLabel: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#333",
    width: 100,
    textAlign: "right",
    marginRight: 20,
  },
  finalTotalValue: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#333",
    width: 80,
    textAlign: "right",
  },
  amountInWords: {
    fontSize: 10,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: "#333",
  },
  paymentSection: {
    marginBottom: 20,
  },
  paymentTitle: {
    fontSize: 11,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#333",
  },
  paymentMethod: {
    fontSize: 10,
    color: "#666",
  },
  termsSection: {
    marginTop: 20,
  },
  termsTitle: {
    fontSize: 11,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  termItem: {
    fontSize: 9,
    color: "#666",
    marginBottom: 8,
    lineHeight: 1.4,
  },
  signature: {
    marginTop: 40,
    fontSize: 10,
    // width: '',
    color: "#666",
    display: "flex",
    // alignItems: 'flex-end'
  },
  signatureLine: {
    borderBottomWidth: 1,
    borderBottomColor: "#333",
    width: 200,
    marginTop: 5,
  },
});

// Helper functions
const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
};

const formatAmount = (amount) => {
  return `Rs. ${(amount / 100).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

const numberToWords = (amount) => {
  const ones = [
    "",
    "One",
    "Two",
    "Three",
    "Four",
    "Five",
    "Six",
    "Seven",
    "Eight",
    "Nine",
  ];
  const teens = [
    "Ten",
    "Eleven",
    "Twelve",
    "Thirteen",
    "Fourteen",
    "Fifteen",
    "Sixteen",
    "Seventeen",
    "Eighteen",
    "Nineteen",
  ];
  const tens = [
    "",
    "",
    "Twenty",
    "Thirty",
    "Forty",
    "Fifty",
    "Sixty",
    "Seventy",
    "Eighty",
    "Ninety",
  ];

  const convertHundreds = (num) => {
    let result = "";
    if (num > 99) {
      result += ones[Math.floor(num / 100)] + " Hundred ";
      num %= 100;
    }
    if (num > 19) {
      result += tens[Math.floor(num / 10)] + " ";
      num %= 10;
    } else if (num > 9) {
      result += teens[num - 10] + " ";
      num = 0;
    }
    if (num > 0) {
      result += ones[num] + " ";
    }
    return result;
  };

  let rupees = Math.floor(amount / 100);
  const paisa = amount % 100;

  let result = "";
  if (rupees > 0) {
    if (rupees >= 10000000) {
      result += convertHundreds(Math.floor(rupees / 10000000)) + "Crore ";
      rupees %= 10000000;
    }
    if (rupees >= 100000) {
      result += convertHundreds(Math.floor(rupees / 100000)) + "Lakh ";
      rupees %= 100000;
    }
    if (rupees >= 1000) {
      result += convertHundreds(Math.floor(rupees / 1000)) + "Thousand ";
      rupees %= 1000;
    }
    if (rupees > 0) {
      result += convertHundreds(rupees);
    }
    result += "Rupees ";
  }

  if (paisa > 0) {
    result += convertHundreds(paisa) + "Paisa ";
  }

  return result.trim() + " Only";
};

// PDF Document Component
const InvoicePDF = ({
  orderData,
}: {
  orderData: {
    id: string | number;
    createdAt: string;
    company?: string;
    subscription: { name: string; price: number };
    description?: { key: string; value: string }[];
    unit: number;
    amount: number;
  };
}) => {
  const descriptionItems = orderData.description ?? [];
  const descriptionString =
    descriptionItems.length > 0
      ? descriptionItems.map((d) => `${d.key}: ${d.value}`).join(", ")
      : "";

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          {/* <Text style={styles.logo}>🧠 FACT FLOW</Text> */}
          <Image
            src={logo}
            style={{
              // width: 100,
              height: 25,
              objectFit: "contain",
            }}
          />

          {/* </Image> */}
          <View>
            <Text style={styles.invoiceTitle}>INVOICE</Text>
            {/* <Text style={styles.invoiceNumber}># INV-{orderData.id}</Text> */}
          </View>
        </View>

        {/* Company Information */}
        <View style={styles.companySection}>
          <View style={styles.companyInfo}>
            <Text style={styles.sectionTitle}>FACT FLOW</Text>
            <Text style={styles.companyName}>NR, KALUPUR BANK BOPAL</Text>
            <Text style={styles.address}>AHMEDABAD GUJARAT</Text>
            <Text style={styles.address}>IN 380058</Text>
          </View>
          <View style={styles.billTo}>
            <Text style={styles.sectionTitle}>Bill To:</Text>
            <Text style={styles.companyName}>{orderData?.company}</Text>
            {/* <Text style={styles.companyName}>SERVICES</Text> */}
          </View>
        </View>

        {/* Invoice Details */}
        <View style={styles.invoiceDetails}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Invoice Number:</Text>
            <Text style={styles.detailValue}>{orderData.id}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Invoice Date:</Text>
            <Text style={styles.detailValue}>
              {formatDate(orderData.createdAt)}
            </Text>
          </View>
        </View>

        {/* Table */}
        <View style={styles.table}>
          {/* Table Header */}
          <View style={styles.tableHeader}>
            <Text style={[styles.tableHeaderText, styles.itemNumber]}>#</Text>
            <Text style={[styles.tableHeaderText, styles.itemName]}>Item</Text>
            <Text style={[styles.tableHeaderText, styles.itemCode]}>
              HSN/SAC
            </Text>
            <Text style={[styles.tableHeaderText, styles.itemMonths]}>
              Months
            </Text>
            <Text style={[styles.tableHeaderText, styles.itemRate]}>Rate</Text>
            <Text style={[styles.tableHeaderText, styles.itemAmount]}>
              Amount
            </Text>
          </View>

          {/* Table Row */}
          <View style={styles.tableRow}>
            <Text style={[styles.tableCell, styles.itemNumber]}>1</Text>
            <View style={[styles.itemName]}>
              <Text
                style={[styles.tableCell, { fontWeight: "bold", fontSize: 10 }]}
              >
                {orderData.subscription.name.toUpperCase()}
              </Text>
              <Text
                style={[
                  styles.tableCell,
                  { fontSize: 8, color: "#666", marginTop: 2 },
                ]}
              >
                {descriptionString}
              </Text>
              {/* <Text style={[styles.tableCell, { fontSize: 8, color: '#666', marginTop: 2 }]}>
                ({orderData.values})
              </Text> */}
            </View>
            <Text style={[styles.tableCell, styles.itemCode]}>997331</Text>
            <Text style={[styles.tableCell, styles.itemMonths]}>
              {orderData.unit}
            </Text>
            <Text style={[styles.tableCell, styles.itemRate]}>
              {" "}
              Rs. {orderData.subscription.price.toLocaleString("en-IN")}
            </Text>
            <Text style={[styles.tableCell, styles.itemAmount]}>
              {formatAmount(orderData.amount)}
            </Text>
          </View>
        </View>

        {/* Totals Section */}
        <View style={styles.totalsSection}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Sub Total</Text>
            <Text style={styles.totalValue}>
              {formatAmount(orderData.amount)}
            </Text>
          </View>

          <View style={styles.finalTotalRow}>
            <Text style={styles.finalTotalLabel}>Total</Text>
            <Text style={styles.finalTotalValue}>
              {formatAmount(orderData.amount)}
            </Text>
          </View>

          <View style={styles.totalRow}>
            <Text style={styles.finalTotalLabel}>Amount Due</Text>
            <Text style={styles.finalTotalValue}>
              {formatAmount(orderData.amount)}
            </Text>
          </View>
        </View>

        {/* Amount in Words */}
        <Text style={styles.amountInWords}>
          With words: {numberToWords(orderData.amount)}
        </Text>

        {/* Payment Method */}
        <View style={styles.paymentSection}>
          <Text style={styles.paymentTitle}>Online Payment:</Text>
          <Text style={styles.paymentMethod}>Razorpay</Text>
        </View>

        {/* Terms & Conditions */}
        <View style={styles.termsSection}>
          <Text style={styles.termsTitle}>Terms & Conditions:</Text>
          <Text style={styles.termItem}>
            - This is Computer Generated Invoice and hence does not requires
            signature.
          </Text>
          <Text style={styles.termItem}>
            - TDS (if applicable) to be deducted @ 2% rate u/s 194J(a) of the
            Income Tax Act.
          </Text>
          <Text style={styles.termItem}>
            - Subject to Ahmedabad Jurisdiction.
          </Text>
          <Text style={styles.termItem}>
            - Non Fulfilment of Payment by due date will be charged Interest at
            the rate of 18% P.A.
          </Text>
          <Text style={styles.termItem}>- E O & E.</Text>
        </View>

        {/* Signature */}
        <View style={styles.signature}>
          <Text>Authorized Signature</Text>
          <View style={styles.signatureLine}></View>
        </View>
      </Page>
    </Document>
  );
};

// Main function to generate and download PDF
export const generateAndDownloadInvoicePDF = async (orderData) => {
  try {
    // Generate PDF
    const blob = await pdf(<InvoicePDF orderData={orderData} />).toBlob();

    // Create download link
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `invoice-${orderData.id}.pdf`;

    // Trigger download
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Clean up
    URL.revokeObjectURL(url);

    return { success: true, message: "Invoice downloaded successfully!" };
  } catch (error) {
    console.error("Error generating PDF:", error);
    return { success: false, message: "Failed to generate invoice PDF" };
  }
};

// Alternative function for custom success/error handling
export const downloadInvoicePDF = async (
  orderData: any,
  onSuccess: (arg0: string) => any,
  onError: (arg0: string) => any
) => {
  const result = await generateAndDownloadInvoicePDF(orderData);

  if (result.success) {
    onSuccess && onSuccess(result.message);
  } else {
    onError && onError(result.message);
  }
};
