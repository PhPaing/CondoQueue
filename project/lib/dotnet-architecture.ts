/**
 * Mock .NET 8 Web API - Clean Architecture Structure
 * ================================================
 *
 * This file documents the simulated .NET 8 backend architecture.
 * The actual API calls are handled by lib/api.ts which mimics
 * the controller endpoints with realistic async delays.
 *
 * ┌─────────────────────────────────────────────────────┐
 * │                    API Layer                         │
 * │  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ │
 * │  │RepairController│ │BillController│ │ChatController│ │
 * │  └──────┬───────┘ └──────┬───────┘ └──────┬───────┘ │
 * ├─────────┼────────────────┼────────────────┼─────────┤
 * │         │   Service Layer│                │         │
 * │  ┌──────▼───────┐ ┌──────▼───────┐ ┌──────▼───────┐ │
 * │  │RepairService  │ │BillService   │ │ChatService   │ │
 * │  └──────┬───────┘ └──────┬───────┘ └──────┬───────┘ │
 * ├─────────┼────────────────┼────────────────┼─────────┤
 * │         │  Repository    │                │         │
 * │  ┌──────▼───────┐ ┌──────▼───────┐ ┌──────▼───────┐ │
 * │  │RepairRepo     │ │BillRepo      │ │ChatRepo      │ │
 * │  └──────┬───────┘ └──────┬───────┘ └──────┬───────┘ │
 * ├─────────┼────────────────┼────────────────┼─────────┤
 * │              Data Layer (In-Memory)                 │
 * └─────────────────────────────────────────────────────┘
 *
 * Controllers (simulated in lib/api.ts):
 *
 *   RepairController:
 *     GET    /api/repairs           → RepairApi.getAll()
 *     POST   /api/repairs           → RepairApi.create()
 *     PUT    /api/repairs/{id}/status → RepairApi.updateStatus()
 *     DELETE /api/repairs/{id}      → RepairApi.delete()
 *
 *   BillController:
 *     GET    /api/bills             → BillApi.getAll()
 *     POST   /api/bills/{id}/pay    → BillApi.pay()
 *
 *   ChatController:
 *     GET    /api/chat/messages     → ChatApi.getMessages()
 *     POST   /api/chat/send         → ChatApi.sendMessage()
 *
 * Equivalent .NET Controller Example:
 *
 *   [ApiController]
 *   [Route("api/[controller]")]
 *   public class RepairController : ControllerBase
 *   {
 *       private readonly IRepairService _service;
 *
 *       public RepairController(IRepairService service)
 *       {
 *           _service = service;
 *       }
 *
 *       [HttpGet]
 *       public async Task<ActionResult<IEnumerable<RepairDto>>> GetAll()
 *           => Ok(await _service.GetAllAsync());
 *
 *       [HttpPost]
 *       public async Task<ActionResult<RepairDto>> Create([FromBody] CreateRepairDto dto)
 *       {
 *           var repair = await _service.CreateAsync(dto);
 *           return CreatedAtAction(nameof(GetAll), new { id = repair.Id }, repair);
 *       }
 *
 *       [HttpPut("{id}/status")]
 *       public async Task<IActionResult> UpdateStatus(string id, [FromBody] UpdateStatusDto dto)
 *       {
 *           await _service.UpdateStatusAsync(id, dto.Status);
 *           return NoContent();
 *       }
 *   }
 *
 * Data flow: Controller → Service → Repository → InMemoryDb
 * The frontend talks to lib/api.ts which simulates this entire pipeline.
 */
export const API_DOCS = true;
