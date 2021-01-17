package helper

import (
	"fmt"
	"math"
)

func main() {
	calculateTransverseSpin(2062, 2.4569, 26.067, -30.2297, 8.1994, -123.4441, 2.884)
}
func calculateTransverseSpin(totalSpin float64, accX float64, accY float64, accZ float64, velX float64, velY float64, velZ float64) float64 {

	var totalV = math.Sqrt(math.Pow(velX, 2) + math.Pow(velY, 2) + math.Pow(velZ, 2))
	var totalDrag = -(accX*velX + accY*velY + (accZ+32.1174)*velZ) / totalV

	var accMagX = accX + totalDrag*velX/totalV
	var accMagY = accY + totalDrag*velY/totalV
	var accMagZ = accZ + totalDrag*velZ/totalV + 32.174

	var totalMagnus = math.Sqrt(math.Pow(accMagX, 2) + math.Pow(accMagY, 2) + math.Pow(accMagZ, 2))

	var CL = totalMagnus / (0.07182 * .075 * math.Pow(totalV, 2))

	var S = .166 * math.Log(.336/(.336-CL))

	var Tspin = 78.92 * S * totalV

	fmt.Println(Tspin)

	return Tspin

}
