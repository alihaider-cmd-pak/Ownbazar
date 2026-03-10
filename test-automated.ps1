$BASE_URL = "http://localhost:3000"
$results = @()

Write-Host "🧪 AUTOMATED TEST SUITE STARTING...`n" -ForegroundColor Cyan

# Test data
$testCart = @(@{
    id = "1771071607988"
    name = "Test Product 1"
    price = 1000
    sku = "1000"
    category = "Fashion And Beauty"
    quantity = 1
})

$shippingAddress = @{
    fullName = "Test User"
    email = "test@example.com"
    phone = "03215865297"
    address = "Test Address"
    city = "Test City"
    state = "Punjab"
    zipCode = "54000"
    country = "Pakistan"
}

# Helper function for API calls
function Make-Request($method, $endpoint, $body) {
    try {
        $params = @{
            Uri = "$BASE_URL$endpoint"
            Method = $method
            Headers = @{"Content-Type" = "application/json"}
            ErrorAction = "Stop"
        }
        if ($body) {
            $params["Body"] = ($body | ConvertTo-Json -Depth 10)
        }
        $response = Invoke-WebRequest @params
        return @{
            success = $true
            status = $response.StatusCode
            data = ($response.Content | ConvertFrom-Json)
        }
    } catch {
        return @{
            success = $false
            error = $_.Exception.Message
            status = $_.Exception.Response.StatusCode
        }
    }
}

# TEST 1: COD Order
Write-Host "📋 TEST 1: Creating COD Order..." -ForegroundColor Yellow
$codOrder = @{
    items = $testCart
    subtotal = 1000
    tax = 100
    shipping = 0
    total = 1100
    paymentMethod = "cod"
    shippingAddress = $shippingAddress
}

$cod1 = Make-Request "POST" "/api/orders" $codOrder
if ($cod1.success) {
    $orderId1 = $cod1.data.order.id
    $orderNum1 = $cod1.data.order.orderNumber
    $results += @{
        test = "COD Order"
        status = "✅ PASS"
        orderId = $orderId1
        orderNumber = $orderNum1
        paymentMethod = "cod"
        proofs = "N/A"
    }
    Write-Host "✅ COD order created: $orderNum1" -ForegroundColor Green
} else {
    $results += @{
        test = "COD Order"
        status = "❌ FAIL"
        error = $cod1.error
    }
    Write-Host "❌ COD order failed: $($cod1.error)" -ForegroundColor Red
}

# TEST 2: Bank Transfer with 2 Proofs
Write-Host "`n📋 TEST 2: Creating Bank Transfer Order with 2 proofs..." -ForegroundColor Yellow
$bankOrder = @{
    items = $testCart
    subtotal = 1500
    tax = 150
    shipping = 0
    total = 1650
    paymentMethod = "bank_transfer"
    shippingAddress = $shippingAddress
}

$bank1 = Make-Request "POST" "/api/orders" $bankOrder
if ($bank1.success) {
    $orderId2 = $bank1.data.order.id
    $orderNum2 = $bank1.data.order.orderNumber
    Write-Host "✅ Bank order created: $orderNum2" -ForegroundColor Green
    
    Write-Host "📸 Uploading 2 payment proofs..." -ForegroundColor Yellow
    $proof = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="
    $p1 = "data:image/png;base64,$proof"
    $proofPayload = @{
        orderId = $orderId2
        proofs = @($p1, $p1)
    }
    
    $proofRes = Make-Request "POST" "/api/orders/payment-proof" $proofPayload
    if ($proofRes.success) {
        $results += @{
            test = "Bank Transfer + 2 Proofs"
            status = "✅ PASS"
            orderId = $orderId2
            orderNumber = $orderNum2
            paymentMethod = "bank_transfer"
            proofs = 2
        }
        Write-Host "✅ 2 Proofs uploaded successfully" -ForegroundColor Green
    } else {
        $results += @{
            test = "Bank Transfer + 2 Proofs"
            status = "⚠️ PROOF FAILED"
            error = $proofRes.error
        }
        Write-Host "⚠️ Proof upload failed: $($proofRes.error)" -ForegroundColor Yellow
    }
} else {
    $results += @{
        test = "Bank Transfer Order"
        status = "❌ FAIL"
        error = $bank1.error
    }
    Write-Host "❌ Bank order failed: $($bank1.error)" -ForegroundColor Red
}

# TEST 3: Easypaisa with 3 Proofs
Write-Host "`n📋 TEST 3: Creating Easypaisa Order with 3 proofs..." -ForegroundColor Yellow
$easyOrder = @{
    items = $testCart
    subtotal = 2000
    tax = 200
    shipping = 0
    total = 2200
    paymentMethod = "easypaisa"
    shippingAddress = $shippingAddress
}

$easy1 = Make-Request "POST" "/api/orders" $easyOrder
if ($easy1.success) {
    $orderId3 = $easy1.data.order.id
    $orderNum3 = $easy1.data.order.orderNumber
    Write-Host "✅ Easypaisa order created: $orderNum3" -ForegroundColor Green
    
    Write-Host "📸 Uploading 3 payment proofs..." -ForegroundColor Yellow
    $proof = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="
    $p1 = "data:image/png;base64,$proof"
    $proofPayload = @{
        orderId = $orderId3
        proofs = @($p1, $p1, $p1)
    }
    
    $proofRes = Make-Request "POST" "/api/orders/payment-proof" $proofPayload
    if ($proofRes.success) {
        $results += @{
            test = "Easypaisa + 3 Proofs"
            status = "✅ PASS"
            orderId = $orderId3
            orderNumber = $orderNum3
            paymentMethod = "easypaisa"
            proofs = 3
        }
        Write-Host "✅ 3 Proofs uploaded successfully" -ForegroundColor Green
    } else {
        $results += @{
            test = "Easypaisa + 3 Proofs"
            status = "⚠️ PROOF FAILED"
            error = $proofRes.error
        }
        Write-Host "⚠️ Proof upload failed: $($proofRes.error)" -ForegroundColor Yellow
    }
} else {
    $results += @{
        test = "Easypaisa Order"
        status = "❌ FAIL"
        error = $easy1.error
    }
    Write-Host "❌ Easypaisa order failed: $($easy1.error)" -ForegroundColor Red
}

# TEST 4: JazzCash Order
Write-Host "`n📋 TEST 4: Creating JazzCash Order..." -ForegroundColor Yellow
$jazzOrder = @{
    items = $testCart
    subtotal = 2500
    tax = 250
    shipping = 0
    total = 2750
    paymentMethod = "jazzcash"
    shippingAddress = $shippingAddress
}

$jazz1 = Make-Request "POST" "/api/orders" $jazzOrder
if ($jazz1.success) {
    $orderId4 = $jazz1.data.order.id
    $orderNum4 = $jazz1.data.order.orderNumber
    Write-Host "✅ JazzCash order created: $orderNum4" -ForegroundColor Green
    
    $results += @{
        test = "JazzCash Order"
        status = "✅ PASS"
        orderId = $orderId4
        orderNumber = $orderNum4
        paymentMethod = "jazzcash"
        proofs = "Pending"
    }
} else {
    $results += @{
        test = "JazzCash Order"
        status = "❌ FAIL"
        error = $jazz1.error
    }
    Write-Host "❌ JazzCash order failed: $($jazz1.error)" -ForegroundColor Red
}

# TEST 5: Verify Data Integrity
Write-Host "`n📋 TEST 5: Verifying data in data/orders.json..." -ForegroundColor Yellow
try {
    $ordersFile = Get-Content "d:\WorkSpace\data\orders.json" -Raw | ConvertFrom-Json
    $totalOrders = ($ordersFile | Measure-Object).Count
    if ($totalOrders -eq 1) { $totalOrders = 1 } else { $totalOrders = $ordersFile.Count }
    
    Write-Host "✅ JSON file readable - Total orders: $totalOrders" -ForegroundColor Green
    Write-Host "`n📊 Sample last 3 orders:" -ForegroundColor Cyan
    
    if ($ordersFile -is [array]) {
        $lastThree = $ordersFile | Select-Object -Last 3
    } else {
        $lastThree = @($ordersFile)
    }
    
    $lastThree | ForEach-Object {
        $proofCount = 0
        if ($_.paymentProof -is [array]) {
            $proofCount = $_.paymentProof.Count
        } elseif ($_.paymentProof) {
            $proofCount = 1
        }
        Write-Host "   $($_.orderNumber) | $($_.paymentMethod.ToUpper()) | Proofs: $proofCount | Status: $($_.status)" -ForegroundColor Green
    }
    
    $results += @{
        test = "Data Integrity Check"
        status = "✅ PASS"
        totalOrders = $totalOrders
    }
} catch {
    $results += @{
        test = "Data Integrity Check"
        status = "❌ FAIL"
        error = $_.Exception.Message
    }
    Write-Host "❌ File error: $($_.Exception.Message)" -ForegroundColor Red
}

# SUMMARY
Write-Host "`n`n" 
Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "                    📊 TEST SUMMARY" -ForegroundColor Cyan
Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""

$results | ForEach-Object {
    if ($_.status -like "*✅*") {
        Write-Host "$($_.status) $($_.test)" -ForegroundColor Green
    } elseif ($_.status -like "*⚠️*") {
        Write-Host "$($_.status) $($_.test)" -ForegroundColor Yellow
    } else {
        Write-Host "$($_.status) $($_.test)" -ForegroundColor Red
    }
    
    if ($_.orderId) { Write-Host "        Order ID: $($_.orderId)" -ForegroundColor Gray }
    if ($_.orderNumber) { Write-Host "        Order: $($_.orderNumber)" -ForegroundColor Gray }
    if ($_.proofs -and $_.proofs -ne "N/A" -and $_.proofs -ne "Pending") { Write-Host "        Proofs: $($_.proofs)" -ForegroundColor Gray }
    if ($_.totalOrders) { Write-Host "        Total Orders in DB: $($_.totalOrders)" -ForegroundColor Gray }
    if ($_.error) { Write-Host "        Error: $($_.error)" -ForegroundColor Gray }
}

$passed = ($results | Where-Object { $_.status -like "*✅*" }).Count
$total = $results.Count
Write-Host ""
Write-Host "✅ PASSED: $passed/$total Tests" -ForegroundColor Green
Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""
